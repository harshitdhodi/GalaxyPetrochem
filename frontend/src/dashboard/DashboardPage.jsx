import React from 'react'
import Dashboard from './Dashboard'
import BigCalendarView from './calender/big-calendar-view'
import InquiryLineChart from './chart/LineChart'

const DashboardPage = () => {
  return (
    <div>
      <Dashboard />
    <BigCalendarView/>
    <InquiryLineChart/>
    </div>
  )
}

export default DashboardPage
