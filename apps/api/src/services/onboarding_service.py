"""
Onboarding Service

Business logic for onboarding flow:
- Check onboarding status
- Create personal space
- Generate invite codes
- Create budget with frameworks
- Mark onboarding as complete
"""

import random
import string
from datetime import datetime
from typing import Optional
from supabase import Client

# Budget framework configurations
# category_type must be one of: 'needs', 'wants', 'savings', 'income'
FRAMEWORK_50_30_20 = {
    'needs': {
        'percentage': 0.50,
        'categories': [
            ('Housing', 0.30),  # 30% of needs
            ('Food', 0.30),
            ('Transportation', 0.20),
            ('Utilities', 0.20),
        ]
    },
    'wants': {
        'percentage': 0.30,
        'categories': [
            ('Entertainment', 0.50),  # 50% of wants
            ('Shopping', 0.50),
        ]
    },
    'savings': {
        'percentage': 0.20,
        'categories': [
            ('Savings', 1.00),  # 100% of savings
        ]
    }
}


class OnboardingService:
    """Service class for onboarding operations"""

    def __init__(self, supabase_client: Client):
        self.supabase = supabase_client

    def _generate_invite_code(self, length: int = 6) -> str:
        """
        Generate unique invite code

        Args:
            length: Code length (default: 6)

        Returns:
            Unique alphanumeric code (without O, 0, I, 1)
        """
        # Characters without confusing ones
        chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

        while True:
            code = ''.join(random.choices(chars, k=length))

            # Check if code already exists
            result = self.supabase.table('spaces').select('id').eq('invite_code', code).execute()

            if len(result.data) == 0:
                return code

    async def get_onboarding_status(self, user_id: str) -> dict:
        """
        Check user's onboarding status

        Args:
            user_id: User UUID

        Returns:
            Dict with onboarding status flags
        """
        # Check if onboarding completed
        user_result = self.supabase.table('user_profiles').select('onboarding_completed').eq('id', user_id).execute()

        onboarding_completed = False
        if user_result.data and len(user_result.data) > 0:
            onboarding_completed = user_result.data[0].get('onboarding_completed', False)

        # Check if has personal space
        space_result = self.supabase.table('spaces').select('id').eq('created_by', user_id).eq('is_personal', True).execute()
        has_personal_space = len(space_result.data) > 0

        # Check if has any budget
        budget_result = self.supabase.table('budgets').select('id').in_(
            'space_id',
            [s['id'] for s in space_result.data] if space_result.data else []
        ).execute()
        has_budget = len(budget_result.data) > 0

        return {
            'needs_onboarding': not onboarding_completed,
            'has_personal_space': has_personal_space,
            'has_budget': has_budget,
            'user_id': user_id
        }

    async def create_personal_space(self, user_id: str, name: str, currency: str) -> dict:
        """
        Create personal space for user

        Args:
            user_id: User UUID
            name: Space name
            currency: Currency code (USD/CAD/MXN)

        Returns:
            Created space data

        Raises:
            ValueError: If user already has personal space
        """
        # Check if user already has personal space
        existing = self.supabase.table('spaces').select('id').eq('created_by', user_id).eq('is_personal', True).execute()

        if len(existing.data) > 0:
            raise ValueError('User already has a personal space')

        # Generate unique invite code
        invite_code = self._generate_invite_code()

        # Create space
        space_data = {
            'name': name.strip(),
            'currency': currency,
            'is_personal': True,
            'invite_code': invite_code,
            'created_by': user_id,
        }

        space_result = self.supabase.table('spaces').insert(space_data).execute()

        if not space_result.data or len(space_result.data) == 0:
            raise Exception('Failed to create space')

        created_space = space_result.data[0]

        # Add user as owner in space_members
        member_data = {
            'space_id': created_space['id'],
            'user_id': user_id,
            'role': 'owner'
        }

        self.supabase.table('space_members').insert(member_data).execute()

        return created_space

    def _generate_budget_items_50_30_20(self, monthly_income: float) -> list[dict]:
        """
        Generate budget items using 50/30/20 framework

        Args:
            monthly_income: Total monthly income

        Returns:
            List of budget item dicts
        """
        items = []

        for type_key, type_config in FRAMEWORK_50_30_20.items():
            type_amount = monthly_income * type_config['percentage']
            type_name = type_key  # 'needs', 'wants', 'savings'

            for category_name, category_percentage in type_config['categories']:
                amount = type_amount * category_percentage
                items.append({
                    'category': category_name,
                    'budgeted_amount': round(amount, 2),
                    'spent_amount': 0,
                    'category_type': type_name
                })

        return items

    async def create_budget(self, user_id: str, space_id: str, monthly_income: Optional[float], framework: str) -> dict:
        """
        Create budget via onboarding

        Args:
            user_id: User UUID
            space_id: Space UUID
            monthly_income: Monthly income (optional if skip)
            framework: Budget framework (50_30_20, zero_based, skip)

        Returns:
            Created budget data or skip confirmation
        """
        print(f"[DEBUG] create_budget called with: user_id={user_id}, space_id={space_id}, income={monthly_income}, framework={framework}")

        # If skip, return immediately
        if framework == 'skip':
            return {'skipped': True}

        # Verify space belongs to user
        space_result = self.supabase.table('spaces').select('id').eq('id', space_id).eq('created_by', user_id).execute()

        if len(space_result.data) == 0:
            raise ValueError('Space not found or not owned by user')

        # Create budget name from current month
        budget_name = datetime.now().strftime('%B %Y')
        month_period = datetime.now().strftime('%Y-%m')

        budget_data = {
            'space_id': space_id,
            'name': budget_name,
            'type': 'master',
            'month_period': month_period,
            'total_income': monthly_income or 0,
            'framework': framework,
            'auto_generated': True,
        }

        budget_result = self.supabase.table('budgets').insert(budget_data).execute()

        if not budget_result.data or len(budget_result.data) == 0:
            raise Exception('Failed to create budget')

        created_budget = budget_result.data[0]

        # Generate budget items if 50/30/20
        items = []
        if framework == '50_30_20' and monthly_income:
            item_data = self._generate_budget_items_50_30_20(monthly_income)

            # Add budget_id to each item
            for item in item_data:
                item['budget_id'] = created_budget['id']

            # Debug: print what we're trying to insert
            print(f"[DEBUG] Inserting {len(item_data)} budget items:")
            for item in item_data:
                print(f"  - {item}")

            # Insert items
            try:
                items_result = self.supabase.table('budget_items').insert(item_data).execute()
                items = items_result.data if items_result.data else []
                print(f"[DEBUG] Successfully inserted {len(items)} items")
            except Exception as e:
                print(f"[ERROR] Failed to insert items: {str(e)}")
                raise

        return {
            'budget': {
                **created_budget,
                'items': items
            }
        }

    async def complete_onboarding(self, user_id: str) -> dict:
        """
        Mark user's onboarding as complete

        Args:
            user_id: User UUID

        Returns:
            Completion confirmation
        """
        result = self.supabase.table('user_profiles').update({
            'onboarding_completed': True
        }).eq('id', user_id).execute()

        if not result.data:
            raise Exception('Failed to complete onboarding')

        return {
            'onboarding_completed': True,
            'redirect_to': '/dashboard'
        }
