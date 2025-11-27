#!/usr/bin/env python3
"""
Automated Flood Risk Prediction Analysis Script

This script:
1. Fetches latest sensor data from Firebase (water level, rainfall, humidity)
2. Performs flood risk analysis
3. Generates a visualization graph
4. Creates a text summary
5. Saves outputs for the website to display
"""

import os
import json
import sys
from datetime import datetime
from typing import Dict, Any, Optional

import firebase_admin
from firebase_admin import credentials, db
import pandas as pd
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend for server environments
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from matplotlib.figure import Figure

# Configuration
FIREBASE_DB_PATH = "sensors/latest"
# Path to latest sensor readings
FIREBASE_DATABASE_URL = "https://aura-data-cb5bf-default-rtdb.asia-southeast1.firebasedatabase.app"
OUTPUT_GRAPH = "analysis_graph.png"
OUTPUT_SUMMARY_JSON = "analysis_summary.json"
OUTPUT_SUMMARY_TXT = "analysis_summary.txt"

# Flood risk thresholds (adjust based on your sensor calibration)
WATER_LEVEL_SAFE = 50      # cm - below this is safe
WATER_LEVEL_WARNING = 100  # cm - warning level
WATER_LEVEL_DANGER = 150   # cm - danger/flood level

RAINFALL_SAFE = 5          # mm - light rain
RAINFALL_WARNING = 20     # mm - moderate rain
RAINFALL_DANGER = 50      # mm - heavy rain

HUMIDITY_NORMAL_MIN = 40  # %
HUMIDITY_NORMAL_MAX = 80  # %


def initialize_firebase() -> None:
    """Initialize Firebase Admin SDK with service account credentials."""
    if firebase_admin._apps:
        return

    service_account_json = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON")

    if service_account_json:
        try:
            cred_dict = json.loads(service_account_json)
            database_url = (
                cred_dict.get("databaseURL")
                or os.environ.get("FIREBASE_DATABASE_URL")
                or FIREBASE_DATABASE_URL
            )
            firebase_admin.initialize_app(
                credentials.Certificate(cred_dict),
                {"databaseURL": database_url} if database_url else None,
            )
            print("✓ Firebase initialized from FIREBASE_SERVICE_ACCOUNT_JSON")
            return
        except json.JSONDecodeError as error:
            print(f"⚠ Warning: Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON: {error}")

    service_account_file = "serviceAccountKey.json"
    if os.path.exists(service_account_file):
        cred = credentials.Certificate(service_account_file)
        database_url = (
            os.environ.get("FIREBASE_DATABASE_URL")
            or FIREBASE_DATABASE_URL
        )
        firebase_admin.initialize_app(
            cred,
            {"databaseURL": database_url} if database_url else None,
        )
        print("✓ Firebase initialized from serviceAccountKey.json")
        return

    raise RuntimeError(
        "Firebase credentials not found. "
        "Set FIREBASE_SERVICE_ACCOUNT_JSON (for GitHub Actions) or place "
        "serviceAccountKey.json in the project root for local testing."
    )


def fetch_sensor_data() -> Optional[Dict[str, Any]]:
    """Fetch the latest sensor readings from Firebase."""
    try:
        ref = db.reference(FIREBASE_DB_PATH)
        print(ref)
        data = ref.get()
        print(data)
        
        if data is None:
            print("⚠ Warning: No data found at path 'sensors/latest'")
            return None
        
        print(f"✓ Fetched sensor data: {json.dumps(data, indent=2)}")
        return data
    except Exception as e:
        print(f"✗ Error fetching sensor data: {e}")
        return None


def analyze_flood_risk(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Perform flood risk analysis based on sensor readings.
    
    Returns a dictionary with:
    - risk_level: 'low', 'moderate', 'high', 'critical'
    - risk_score: 0-100
    - factors: list of contributing factors
    - recommendations: list of action items
    """
    water_level = data.get('waterLevel', 0)
    rainfall = data.get('rainfall', 0)
    humidity = data.get('humidity', 0)
    temperature = data.get('temperature', 0)
    timestamp = data.get('timestamp', 0)
    
    factors = []
    risk_score = 0
    
    # Analyze water level
    if water_level >= WATER_LEVEL_DANGER:
        factors.append(f"⚠️ Critical water level: {water_level} cm (exceeds danger threshold of {WATER_LEVEL_DANGER} cm)")
        risk_score += 50
    elif water_level >= WATER_LEVEL_WARNING:
        factors.append(f"⚠️ Elevated water level: {water_level} cm (warning threshold: {WATER_LEVEL_WARNING} cm)")
        risk_score += 30
    elif water_level >= WATER_LEVEL_SAFE:
        factors.append(f"ℹ️ Water level: {water_level} cm (within safe range)")
        risk_score += 10
    else:
        factors.append(f"✓ Water level: {water_level} cm (normal)")
    
    # Analyze rainfall
    if rainfall >= RAINFALL_DANGER:
        factors.append(f"⚠️ Heavy rainfall: {rainfall} mm (exceeds danger threshold of {RAINFALL_DANGER} mm)")
        risk_score += 40
    elif rainfall >= RAINFALL_WARNING:
        factors.append(f"⚠️ Moderate rainfall: {rainfall} mm (warning threshold: {RAINFALL_WARNING} mm)")
        risk_score += 25
    elif rainfall >= RAINFALL_SAFE:
        factors.append(f"ℹ️ Light rainfall: {rainfall} mm")
        risk_score += 5
    else:
        factors.append(f"✓ No significant rainfall: {rainfall} mm")
    
    # Analyze humidity (affects flood risk indirectly)
    if humidity > HUMIDITY_NORMAL_MAX:
        factors.append(f"ℹ️ High humidity: {humidity}% (may indicate continued precipitation)")
        risk_score += 5
    elif humidity < HUMIDITY_NORMAL_MIN:
        factors.append(f"ℹ️ Low humidity: {humidity}%")
    else:
        factors.append(f"✓ Humidity: {humidity}% (normal)")
    
    # Determine overall risk level
    if risk_score >= 70:
        risk_level = 'critical'
        recommendations = [
            "🚨 IMMEDIATE ACTION REQUIRED: Evacuate low-lying areas",
            "Monitor water levels continuously",
            "Alert emergency services if water continues to rise",
            "Avoid riverbanks and flood-prone zones"
        ]
    elif risk_score >= 50:
        risk_level = 'high'
        recommendations = [
            "⚠️ High flood risk detected - Prepare for potential flooding",
            "Stay away from riverbanks",
            "Monitor updates closely",
            "Prepare emergency supplies"
        ]
    elif risk_score >= 30:
        risk_level = 'moderate'
        recommendations = [
            "⚠️ Moderate flood risk - Stay alert",
            "Monitor weather conditions",
            "Avoid unnecessary travel near the river"
        ]
    else:
        risk_level = 'low'
        recommendations = [
            "✓ Current conditions are stable",
            "Continue monitoring for changes",
            "No immediate action required"
        ]
    
    return {
        'risk_level': risk_level,
        'risk_score': min(risk_score, 100),
        'factors': factors,
        'recommendations': recommendations,
        'water_level': water_level,
        'rainfall': rainfall,
        'humidity': humidity,
        'temperature': temperature,
        'timestamp': timestamp
    }


def generate_graph(data: Dict[str, Any], analysis: Dict[str, Any]) -> Figure:
    """
    Generate a visualization graph showing sensor readings and risk assessment.
    """
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))
    fig.suptitle('Flood Risk Prediction Analysis', fontsize=16, fontweight='bold', y=0.995)
    
    # Color scheme based on risk level
    risk_colors = {
        'low': '#10b981',      # green
        'moderate': '#f59e0b',  # amber
        'high': '#ef4444',     # red
        'critical': '#dc2626'  # dark red
    }
    risk_color = risk_colors.get(analysis['risk_level'], '#6b7280')
    
    # 1. Water Level Gauge
    ax1 = axes[0, 0]
    water_level = analysis['water_level']
    ax1.barh([0], [water_level], color=risk_color, alpha=0.7, height=0.5)
    ax1.axvline(WATER_LEVEL_SAFE, color='green', linestyle='--', alpha=0.5, label='Safe')
    ax1.axvline(WATER_LEVEL_WARNING, color='orange', linestyle='--', alpha=0.5, label='Warning')
    ax1.axvline(WATER_LEVEL_DANGER, color='red', linestyle='--', alpha=0.5, label='Danger')
    ax1.set_xlabel('Water Level (cm)', fontweight='bold')
    ax1.set_title(f'Current Water Level: {water_level} cm', fontweight='bold')
    ax1.set_yticks([])
    ax1.legend(loc='upper right')
    ax1.grid(True, alpha=0.3)
    
    # 2. Rainfall Indicator
    ax2 = axes[0, 1]
    rainfall = analysis['rainfall']
    bars = ax2.bar(['Rainfall'], [rainfall], color=risk_color, alpha=0.7)
    ax2.axhline(RAINFALL_SAFE, color='green', linestyle='--', alpha=0.5, label='Light')
    ax2.axhline(RAINFALL_WARNING, color='orange', linestyle='--', alpha=0.5, label='Moderate')
    ax2.axhline(RAINFALL_DANGER, color='red', linestyle='--', alpha=0.5, label='Heavy')
    ax2.set_ylabel('Rainfall (mm)', fontweight='bold')
    ax2.set_title(f'Current Rainfall: {rainfall} mm', fontweight='bold')
    ax2.legend(loc='upper right')
    ax2.grid(True, alpha=0.3, axis='y')
    
    # 3. Risk Score Gauge
    ax3 = axes[1, 0]
    risk_score = analysis['risk_score']
    risk_level = analysis['risk_level'].upper()
    # Create a pie chart style gauge
    colors_gauge = ['#10b981' if risk_score < 30 else '#f59e0b' if risk_score < 50 else '#ef4444' if risk_score < 70 else '#dc2626']
    ax3.barh([0], [risk_score], color=colors_gauge[0], alpha=0.8, height=0.6)
    ax3.set_xlim(0, 100)
    ax3.set_xlabel('Risk Score (0-100)', fontweight='bold')
    ax3.set_title(f'Flood Risk Level: {risk_level}\nRisk Score: {risk_score}/100', fontweight='bold')
    ax3.set_yticks([])
    ax3.grid(True, alpha=0.3, axis='x')
    
    # 4. Environmental Conditions
    ax4 = axes[1, 1]
    temp = analysis.get('temperature', 0)
    humidity = analysis.get('humidity', 0)
    categories = ['Temperature\n(°C)', 'Humidity\n(%)']
    values = [temp, humidity]
    colors = ['#3b82f6', '#8b5cf6']
    bars = ax4.bar(categories, values, color=colors, alpha=0.7)
    ax4.set_ylabel('Value', fontweight='bold')
    ax4.set_title('Environmental Conditions', fontweight='bold')
    ax4.grid(True, alpha=0.3, axis='y')
    # Add value labels on bars
    for bar, val in zip(bars, values):
        height = bar.get_height()
        ax4.text(bar.get_x() + bar.get_width()/2., height,
                f'{val:.1f}',
                ha='center', va='bottom', fontweight='bold')
    
    plt.tight_layout()
    return fig


def create_summary(analysis: Dict[str, Any]) -> str:
    """Create a human-readable text summary of the analysis."""
    timestamp_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')
    
    summary_lines = [
        "=" * 60,
        "FLOOD RISK PREDICTION ANALYSIS",
        "=" * 60,
        f"Generated: {timestamp_str}",
        "",
        f"RISK ASSESSMENT: {analysis['risk_level'].upper()}",
        f"Risk Score: {analysis['risk_score']}/100",
        "",
        "CURRENT SENSOR READINGS:",
        f"  • Water Level: {analysis['water_level']} cm",
        f"  • Rainfall: {analysis['rainfall']} mm",
        f"  • Humidity: {analysis['humidity']}%",
        f"  • Temperature: {analysis.get('temperature', 'N/A')}°C",
        "",
        "ANALYSIS FACTORS:",
    ]
    
    for factor in analysis['factors']:
        summary_lines.append(f"  {factor}")
    
    summary_lines.extend([
        "",
        "RECOMMENDATIONS:",
    ])
    
    for rec in analysis['recommendations']:
        summary_lines.append(f"  {rec}")
    
    summary_lines.extend([
        "",
        "=" * 60,
        "This analysis is automatically generated by the AURA monitoring system.",
        "=" * 60
    ])
    
    return "\n".join(summary_lines)


def main():
    """Main execution function."""
    print("=" * 60)
    print("AURA Flood Risk Prediction Analysis")
    print("=" * 60)
    print()
    
    try:
        # Initialize Firebase
        initialize_firebase()
        
        # Fetch sensor data
        print("\n[1/4] Fetching sensor data from Firebase...")
        data = fetch_sensor_data()
        
        if data is None:
            print("✗ Cannot proceed without sensor data. Exiting.")
            sys.exit(1)
        
        # Perform analysis
        print("\n[2/4] Performing flood risk analysis...")
        analysis = analyze_flood_risk(data)
        print(f"✓ Risk Level: {analysis['risk_level'].upper()}")
        print(f"✓ Risk Score: {analysis['risk_score']}/100")
        
        # Generate graph
        print("\n[3/4] Generating visualization graph...")
        fig = generate_graph(data, analysis)
        fig.savefig(OUTPUT_GRAPH, dpi=150, bbox_inches='tight', facecolor='white')
        plt.close(fig)
        print(f"✓ Graph saved to {OUTPUT_GRAPH}")
        
        # Create summary
        print("\n[4/4] Creating analysis summary...")
        summary_text = create_summary(analysis)
        
        # Save text summary
        with open(OUTPUT_SUMMARY_TXT, 'w', encoding='utf-8') as f:
            f.write(summary_text)
        print(f"✓ Text summary saved to {OUTPUT_SUMMARY_TXT}")
        
        # Save JSON summary (for programmatic access)
        summary_json = {
            'summary': summary_text,
            'risk_level': analysis['risk_level'],
            'risk_score': analysis['risk_score'],
            'water_level': analysis['water_level'],
            'rainfall': analysis['rainfall'],
            'humidity': analysis['humidity'],
            'temperature': analysis.get('temperature'),
            'factors': analysis['factors'],
            'recommendations': analysis['recommendations'],
            'updatedAt': datetime.now().isoformat() + 'Z',
            'timestamp': datetime.now().isoformat() + 'Z',
            'generatedAt': datetime.now().isoformat() + 'Z',
            'lastUpdated': datetime.now().isoformat() + 'Z'
        }
        
        with open(OUTPUT_SUMMARY_JSON, 'w', encoding='utf-8') as f:
            json.dump(summary_json, f, indent=2, ensure_ascii=False)
        print(f"✓ JSON summary saved to {OUTPUT_SUMMARY_JSON}")
        
        print("\n" + "=" * 60)
        print("✓ Analysis complete! All outputs generated successfully.")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n✗ Error during analysis: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()

