from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)


def test_read_root():
    """Test del endpoint raíz"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data
    assert data["version"] == "1.0.0"


def test_health_check():
    """Test del health check"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data
    assert "version" in data


def test_docs_available():
    """Test que la documentación está accesible"""
    response = client.get("/docs")
    assert response.status_code == 200
