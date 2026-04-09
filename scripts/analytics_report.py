#!/usr/bin/env python3
"""
Script para consultar Google Analytics 4
Uso: python analytics_report.py
"""

import json
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange,
    Dimension,
    Metric,
    RunReportRequest,
)
from google.oauth2 import service_account
import os

# Configuración
PROPERTY_ID = "GA4_PROPERTY_ID"  # Necesito el ID de la propiedad GA4
CREDENTIALS_PATH = ".ga4-service-account.json"

def get_credentials():
    """Carga las credenciales de la cuenta de servicio"""
    credentials = service_account.Credentials.from_service_account_file(
        CREDENTIALS_PATH,
        scopes=["https://www.googleapis.com/auth/analytics.readonly"],
    )
    return credentials

def get_basic_report(property_id):
    """Obtiene reporte básico de los últimos 7 días"""
    credentials = get_credentials()
    client = BetaAnalyticsDataClient(credentials=credentials)
    
    request = RunReportRequest(
        property=f"properties/{property_id}",
        dimensions=[
            Dimension(name="date"),
            Dimension(name="sessionDefaultChannelGroup"),
        ],
        metrics=[
            Metric(name="sessions"),
            Metric(name="activeUsers"),
            Metric(name="newUsers"),
            Metric(name="screenPageViews"),
        ],
        date_ranges=[DateRange(start_date="7daysAgo", end_date="today")],
    )
    
    response = client.run_report(request)
    return response

def print_report(response):
    """Imprime el reporte en formato legible"""
    print("📊 REPORTE GA4 - Últimos 7 días\n")
    print("=" * 60)
    
    for row in response.rows:
        date = row.dimension_values[0].value
        channel = row.dimension_values[1].value
        sessions = row.metric_values[0].value
        active_users = row.metric_values[1].value
        new_users = row.metric_values[2].value
        page_views = row.metric_values[3].value
        
        print(f"\n📅 Fecha: {date}")
        print(f"   Canal: {channel}")
        print(f"   Sesiones: {sessions}")
        print(f"   Usuarios activos: {active_users}")
        print(f"   Nuevos usuarios: {new_users}")
        print(f"   Páginas vistas: {page_views}")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("❌ Error: Necesito el Property ID de GA4")
        print("\nUso: python analytics_report.py GA4_PROPERTY_ID")
        print("\nPara encontrar tu Property ID:")
        print("1. Ve a Google Analytics")
        print("2. Admin → Configuración de la propiedad")
        print("3. El ID empieza con 'properties/' (ej: properties/123456789)")
        sys.exit(1)
    
    property_id = sys.argv[1].replace("properties/", "")
    
    try:
        response = get_basic_report(property_id)
        print_report(response)
    except Exception as e:
        print(f"❌ Error al consultar GA4: {e}")
        print("\nPosibles causas:")
        print("- El Property ID es incorrecto")
        print("- La cuenta de servicio no tiene acceso a GA4")
        print("- La API de Google Analytics no está habilitada en el proyecto")
