"""Database Health Check Routes"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from ...core.database import get_db
from ...core.supabase import supabase
from datetime import datetime

router = APIRouter(prefix="/database", tags=["database"])


@router.get("/health")
async def database_health_check(db: Session = Depends(get_db)):
    """
    Test database connectivity using SQLAlchemy

    Returns database status, version, and connection info
    """
    try:
        # Test basic SQL query
        result = db.execute(text("SELECT version(), current_database(), current_user, now()"))
        row = result.fetchone()

        return {
            "status": "ok",
            "database": {
                "version": row[0].split(" ")[0] + " " + row[0].split(" ")[1],  # PostgreSQL version
                "database_name": row[1],
                "current_user": row[2],
                "server_time": row[3].isoformat()
            },
            "connection": "active",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")


@router.get("/tables")
async def list_tables(db: Session = Depends(get_db)):
    """
    List all tables in the public schema

    Useful for verifying that migrations were applied correctly
    """
    try:
        query = text("""
            SELECT tablename
            FROM pg_tables
            WHERE schemaname = 'public'
            ORDER BY tablename
        """)

        result = db.execute(query)
        tables = [row[0] for row in result.fetchall()]

        expected_tables = [
            "ai_conversations",
            "budget_items",
            "budgets",
            "expense_splits",
            "expenses",
            "financial_insights",
            "space_members",
            "spaces",
            "users"
        ]

        missing_tables = [t for t in expected_tables if t not in tables]
        extra_tables = [t for t in tables if t not in expected_tables]

        return {
            "status": "ok",
            "tables": tables,
            "total_count": len(tables),
            "expected_count": len(expected_tables),
            "validation": {
                "all_present": len(missing_tables) == 0,
                "missing_tables": missing_tables,
                "extra_tables": extra_tables
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list tables: {str(e)}")


@router.get("/supabase/health")
async def supabase_health_check():
    """
    Test Supabase client connectivity

    Verifies that the Supabase client is properly configured
    """
    try:
        # Test a simple Supabase query
        response = supabase.table("users").select("count", count="exact").limit(1).execute()

        return {
            "status": "ok",
            "supabase": {
                "connected": True,
                "url": supabase.supabase_url,
                "user_table_accessible": True
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {
            "status": "error",
            "supabase": {
                "connected": False,
                "error": str(e)
            },
            "timestamp": datetime.utcnow().isoformat()
        }
