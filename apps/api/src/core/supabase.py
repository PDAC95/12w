"""Supabase Client Configuration"""
from supabase import create_client, Client
from .config import settings


def get_supabase_client() -> Client:
    """Create and return Supabase client with service role key"""
    return create_client(
        supabase_url=settings.SUPABASE_URL,
        supabase_key=settings.SUPABASE_SERVICE_KEY
    )


# Global Supabase client instance
supabase: Client = get_supabase_client()
