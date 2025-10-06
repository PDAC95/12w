"""Tests for main FastAPI app"""
import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)


def test_read_root():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Welcome to Wallai API"
    assert "version" in data
    assert "docs" in data


def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "environment" in data
    assert "timestamp" in data
    assert "version" in data


def test_docs_accessible():
    """Test that API docs are accessible"""
    response = client.get("/docs")
    assert response.status_code == 200
