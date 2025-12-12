#!/bin/bash

# API Test Script for Teacher Payroll System

API_URL="http://localhost:3000/api"

echo "🧪 Testing Teacher Payroll API Endpoints\n"

# Test 1: Health Check
echo "1️⃣  Testing Health Endpoint..."
curl -s -X GET "$API_URL/health" | jq .
echo "\n---\n"

# Test 2: Create Teacher
echo "2️⃣  Creating a Teacher..."
TEACHER=$(curl -s -X POST "$API_URL/teachers" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@school.com",
    "name": "John Doe",
    "department": "Mathematics",
    "basic_pay": 30000
  }')
echo "$TEACHER" | jq .
TEACHER_ID=$(echo "$TEACHER" | jq -r '.teacherId')
echo "Created Teacher ID: $TEACHER_ID\n"
echo "---\n"

# Test 3: Get All Teachers
echo "3️⃣  Getting All Teachers..."
curl -s -X GET "$API_URL/teachers" | jq .
echo "\n---\n"

# Test 4: Get Teacher by ID
echo "4️⃣  Getting Teacher by ID ($TEACHER_ID)..."
curl -s -X GET "$API_URL/teachers/$TEACHER_ID" | jq .
echo "\n---\n"

# Test 5: Create Teaching Load
echo "5️⃣  Creating Teaching Load..."
LOAD=$(curl -s -X POST "$API_URL/teaching-load" \
  -H "Content-Type: application/json" \
  -d "{
    \"teacher_id\": $TEACHER_ID,
    \"subject\": \"Mathematics\",
    \"class_section\": \"10-A\",
    \"day\": \"Monday\",
    \"start_time\": \"08:00:00\",
    \"end_time\": \"09:00:00\"
  }")
echo "$LOAD" | jq .
echo "\n---\n"

# Test 6: Submit Attendance
echo "6️⃣  Submitting Attendance..."
ATTENDANCE=$(curl -s -X POST "$API_URL/attendance" \
  -H "Content-Type: application/json" \
  -d "{
    \"teacher_id\": $TEACHER_ID,
    \"subject\": \"Mathematics\",
    \"class_section\": \"10-A\",
    \"date\": \"2025-12-08\",
    \"hours_taught\": 5
  }")
echo "$ATTENDANCE" | jq .
ATTENDANCE_ID=$(echo "$ATTENDANCE" | jq -r '.attendanceId')
echo "\n---\n"

# Test 7: Get Teacher Attendance
echo "7️⃣  Getting Teacher Attendance..."
curl -s -X GET "$API_URL/attendance/teacher/$TEACHER_ID" | jq .
echo "\n---\n"

# Test 8: Approve Attendance
echo "8️⃣  Approving Attendance..."
curl -s -X PATCH "$API_URL/attendance/$ATTENDANCE_ID/approve" | jq .
echo "\n---\n"

# Test 9: Create Notification
echo "9️⃣  Creating Notification..."
curl -s -X POST "$API_URL/notifications" \
  -H "Content-Type: application/json" \
  -d "{
    \"type\": \"Alert\",
    \"message\": \"Teacher attendance submitted\",
    \"related_to\": \"attendance\",
    \"related_id\": $ATTENDANCE_ID
  }" | jq .
echo "\n---\n"

# Test 10: Compute Salary
echo "🔟 Computing Salary..."
curl -s -X POST "$API_URL/salary/compute" \
  -H "Content-Type: application/json" \
  -d "{
    \"teacher_id\": $TEACHER_ID,
    \"period_start\": \"2025-12-01\",
    \"period_end\": \"2025-12-31\",
    \"hourly_rate\": 500,
    \"allowances\": 5000,
    \"deductions\": 1000
  }" | jq .
echo "\n---\n"

echo "✅ All API tests completed!"
