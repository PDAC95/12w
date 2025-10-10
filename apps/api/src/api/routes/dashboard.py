"""
Dashboard API routes
Provides summary statistics and financial overview
"""
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timedelta
from typing import Optional

from ...core.auth import get_current_user
from ...core.database import get_db
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, extract

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/summary")
async def get_dashboard_summary(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get comprehensive dashboard summary for current user
    Returns: monthly balance, savings goals, recent expenses, upcoming bills, etc.
    """
    user_id = current_user.get("id")

    if not user_id:
        raise HTTPException(status_code=401, detail="User not authenticated")

    try:
        # Get current month dates
        now = datetime.now()
        current_month = now.month
        current_year = now.year
        month_start = datetime(current_year, current_month, 1)

        # Calculate next month for upcoming bills
        if current_month == 12:
            next_month = 1
            next_year = current_year + 1
        else:
            next_month = current_month + 1
            next_year = current_year
        month_end = datetime(next_year, next_month, 1)

        # Get user's personal space (assuming one personal space per user for MVP)
        space_query = """
            SELECT s.id, s.name, s.currency
            FROM spaces s
            JOIN space_members sm ON s.id = sm.space_id
            WHERE sm.user_id = :user_id AND s.is_personal = true
            LIMIT 1
        """
        space_result = db.execute(space_query, {"user_id": user_id}).fetchone()

        if not space_result:
            # User hasn't completed onboarding or has no space
            return {
                "success": True,
                "data": {
                    "has_data": False,
                    "space": None,
                    "monthly_balance": None,
                    "saving_goals": [],
                    "recent_expenses": [],
                    "upcoming_bills": [],
                    "weekly_challenges": [],
                    "quick_stats": None,
                    "spending_breakdown": []
                }
            }

        space_id = space_result[0]
        space_name = space_result[1]
        currency = space_result[2] or "USD"

        # Get current month budget
        budget_query = """
            SELECT b.id, b.name, b.total_income, b.framework
            FROM budgets b
            WHERE b.space_id = :space_id
            AND b.month_period = :month_period
            AND b.type = 'master'
            LIMIT 1
        """
        month_period = f"{current_year}-{current_month:02d}"
        budget_result = db.execute(budget_query, {
            "space_id": space_id,
            "month_period": month_period
        }).fetchone()

        if not budget_result:
            # No budget for current month - show empty state
            return {
                "success": True,
                "data": {
                    "has_data": False,
                    "space": {
                        "id": space_id,
                        "name": space_name,
                        "currency": currency
                    },
                    "monthly_balance": None,
                    "saving_goals": [],
                    "recent_expenses": [],
                    "upcoming_bills": [],
                    "weekly_challenges": [],
                    "quick_stats": None,
                    "spending_breakdown": []
                }
            }

        budget_id = budget_result[0]
        budget_name = budget_result[1]
        total_income = float(budget_result[2]) if budget_result[2] else 0.0

        # Get total expenses for current month
        expenses_query = """
            SELECT COALESCE(SUM(e.amount), 0) as total_expenses
            FROM expenses e
            WHERE e.space_id = :space_id
            AND e.date >= :month_start
            AND e.date < :month_end
        """
        expenses_result = db.execute(expenses_query, {
            "space_id": space_id,
            "month_start": month_start,
            "month_end": month_end
        }).fetchone()
        total_expenses = float(expenses_result[0]) if expenses_result else 0.0

        # Monthly Balance
        remaining_balance = total_income - total_expenses
        percent_spent = (total_expenses / total_income * 100) if total_income > 0 else 0

        monthly_balance = {
            "income": total_income,
            "expenses": total_expenses,
            "balance": remaining_balance,
            "percent_spent": round(percent_spent, 1),
            "currency": currency
        }

        # Saving Goals (from budget items with category 'Savings')
        savings_query = """
            SELECT bi.name, bi.planned_amount, COALESCE(bi.spent_amount, 0) as spent_amount
            FROM budget_items bi
            WHERE bi.budget_id = :budget_id
            AND bi.category ILIKE '%saving%'
        """
        savings_result = db.execute(savings_query, {"budget_id": budget_id}).fetchall()

        saving_goals = []
        for row in savings_result:
            goal_name = row[0]
            target = float(row[1]) if row[1] else 0.0
            current = float(row[2]) if row[2] else 0.0
            progress_percent = (current / target * 100) if target > 0 else 0

            saving_goals.append({
                "name": goal_name,
                "target": target,
                "current": current,
                "progress": round(progress_percent, 1),
                "currency": currency
            })

        # Recent Expenses (last 5)
        recent_expenses_query = """
            SELECT e.id, e.description, e.amount, e.category, e.date
            FROM expenses e
            WHERE e.space_id = :space_id
            ORDER BY e.date DESC, e.created_at DESC
            LIMIT 5
        """
        recent_expenses_result = db.execute(recent_expenses_query, {
            "space_id": space_id
        }).fetchall()

        recent_expenses = []
        for row in recent_expenses_result:
            recent_expenses.append({
                "id": str(row[0]),
                "description": row[1],
                "amount": float(row[2]),
                "category": row[3] or "Other",
                "date": row[4].isoformat() if row[4] else None,
                "currency": currency
            })

        # Upcoming Bills (placeholder for now - would need recurring expenses)
        # For MVP, we'll return empty array
        upcoming_bills = []

        # Weekly Challenges (hardcoded for MVP - would be dynamic later)
        weekly_challenges = [
            {
                "id": "challenge-1",
                "title": "Skip the Coffee",
                "description": "Brew coffee at home this week",
                "reward": 25,
                "progress": 3,
                "target": 5,
                "currency": currency
            },
            {
                "id": "challenge-2",
                "title": "No Takeout Thursday",
                "description": "Cook all meals at home on Thursdays",
                "reward": 30,
                "progress": 1,
                "target": 4,
                "currency": currency
            }
        ]

        # Quick Stats
        # Average daily spending
        days_in_month = (month_end - month_start).days
        days_elapsed = (now - month_start).days + 1
        avg_daily_spending = total_expenses / days_elapsed if days_elapsed > 0 else 0

        # Projected end-of-month spending
        projected_spending = avg_daily_spending * days_in_month

        # Biggest expense category
        category_query = """
            SELECT e.category, SUM(e.amount) as total
            FROM expenses e
            WHERE e.space_id = :space_id
            AND e.date >= :month_start
            AND e.date < :month_end
            GROUP BY e.category
            ORDER BY total DESC
            LIMIT 1
        """
        category_result = db.execute(category_query, {
            "space_id": space_id,
            "month_start": month_start,
            "month_end": month_end
        }).fetchone()

        top_category = category_result[0] if category_result else "N/A"
        top_category_amount = float(category_result[1]) if category_result else 0.0

        quick_stats = {
            "avg_daily_spending": round(avg_daily_spending, 2),
            "projected_monthly": round(projected_spending, 2),
            "top_category": top_category,
            "top_category_amount": round(top_category_amount, 2),
            "days_remaining": days_in_month - days_elapsed,
            "currency": currency
        }

        # Spending Breakdown by category
        breakdown_query = """
            SELECT e.category, SUM(e.amount) as total, COUNT(*) as count
            FROM expenses e
            WHERE e.space_id = :space_id
            AND e.date >= :month_start
            AND e.date < :month_end
            GROUP BY e.category
            ORDER BY total DESC
        """
        breakdown_result = db.execute(breakdown_query, {
            "space_id": space_id,
            "month_start": month_start,
            "month_end": month_end
        }).fetchall()

        spending_breakdown = []
        for row in breakdown_result:
            category = row[0] or "Other"
            total = float(row[1])
            count = int(row[2])
            percentage = (total / total_expenses * 100) if total_expenses > 0 else 0

            spending_breakdown.append({
                "category": category,
                "amount": round(total, 2),
                "count": count,
                "percentage": round(percentage, 1),
                "currency": currency
            })

        return {
            "success": True,
            "data": {
                "has_data": True,
                "space": {
                    "id": space_id,
                    "name": space_name,
                    "currency": currency
                },
                "budget": {
                    "id": budget_id,
                    "name": budget_name,
                    "month_period": month_period
                },
                "monthly_balance": monthly_balance,
                "saving_goals": saving_goals,
                "recent_expenses": recent_expenses,
                "upcoming_bills": upcoming_bills,
                "weekly_challenges": weekly_challenges,
                "quick_stats": quick_stats,
                "spending_breakdown": spending_breakdown
            }
        }

    except Exception as e:
        print(f"Error fetching dashboard summary: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching dashboard data: {str(e)}")
