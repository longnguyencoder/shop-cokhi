from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app import models, schemas
from app.api import deps
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/dashboard", response_model=Any)
def get_dashboard_stats(
    db: Session = Depends(deps.get_db),
    current_user: models.user.User = Depends(deps.get_current_active_superuser),
    days: int = 7
) -> Any:
    """
    Get all dashboard statistics: revenue chart, counts, growth.
    """
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    previous_start_date = start_date - timedelta(days=days)

    # 1. Revenue Chart Data
    daily_revenue = db.query(
        func.date(models.order.Order.created_at).label("date"),
        func.sum(models.order.Order.total_amount).label("total")
    ).filter(
        models.order.Order.created_at >= start_date,
        models.order.Order.status != "cancelled"
    ).group_by(
        func.date(models.order.Order.created_at)
    ).all()

    revenue_map = {str(r.date): r.total for r in daily_revenue}
    chart_data = []
    total_revenue_period = 0
    
    for i in range(days):
        day = start_date + timedelta(days=i)
        date_str = day.strftime("%Y-%m-%d")
        rev = revenue_map.get(date_str, 0)
        total_revenue_period += rev
        chart_data.append({
            "date": day.strftime("%d/%m"),
            "full_date": date_str,
            "revenue": rev
        })

    # 2. Previous Period Revenue (for Growth)
    prev_period_revenue = db.query(func.sum(models.order.Order.total_amount)).filter(
        models.order.Order.created_at >= previous_start_date,
        models.order.Order.created_at < start_date,
        models.order.Order.status != "cancelled"
    ).scalar() or 0

    growth = 0
    if prev_period_revenue > 0:
        growth = ((total_revenue_period - prev_period_revenue) / prev_period_revenue) * 100
    elif total_revenue_period > 0:
        growth = 100 # 100% growth if prev was 0

    # 3. Counts
    new_orders_count = db.query(models.order.Order).filter(
        models.order.Order.created_at >= start_date
    ).count()
    
    total_customers = db.query(models.user.User).count()

    return {
        "chart_data": chart_data,
        "summary": {
            "total_revenue": total_revenue_period,
            "new_orders": new_orders_count,
            "total_customers": total_customers,
            "growth": round(growth, 1)
        }
    }
