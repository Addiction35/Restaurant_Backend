# Restaurant POS Backend System

A comprehensive backend system for the Restaurant POS application built with Django, MySQL, and Redis.

## Features

- **User Management**: Role-based authentication and authorization
- **Menu Management**: Categories, items, modifiers, and options
- **Table Management**: Sections, tables, and status tracking
- **Order Processing**: Create, update, and track orders
- **Reservation System**: Manage table reservations
- **Delivery Management**: Assign drivers and track deliveries
- **Financial Transactions**: Record sales, refunds, and expenses
- **Real-time Updates**: WebSocket integration for live order updates
- **Background Tasks**: Celery for scheduled tasks and processing

## Tech Stack

- **Django**: Web framework
- **Django REST Framework**: API development
- **MySQL**: Primary database
- **Redis**: Caching and message broker
- **Channels**: WebSocket support
- **Celery**: Background task processing
- **Docker**: Containerization

## Installation

### Using Docker

1. Clone the repository:
```bash
git clone https://github.com/your-username/restaurant-pos-backend.git
cd restaurant-pos-backend

