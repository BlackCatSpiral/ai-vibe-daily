'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { formatDate } from '@/utils'
import { Calendar, Search, X } from 'lucide-react'

interface NewsItem {
  id: string
  date: string
  title: string
  summary: string
}

interface ArchiveContentProps {
  newsList: NewsItem[]
}

export function ArchiveContent({ newsList }: ArchiveContentProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedDay, setSelectedDay] = useState('')

  // 提取所有可用的年份
  const availableYears = useMemo(() => {
    const years = new Set(newsList.map(news => news.date.slice(0, 4)))
    return Array.from(years).sort((a, b) => b.localeCompare(a))
  }, [newsList])

  // 根据选中的年份提取可用的月份
  const availableMonths = useMemo(() => {
    if (!selectedYear) return []
    const months = new Set(
      newsList
        .filter(news => news.date.startsWith(selectedYear))
        .map(news => news.date.slice(5, 7))
    )
    return Array.from(months).sort()
  }, [newsList, selectedYear])

  // 根据选中的年月提取可用的日期
  const availableDays = useMemo(() => {
    if (!selectedYear || !selectedMonth) return []
    const prefix = `${selectedYear}-${selectedMonth}`
    const days = new Set(
      newsList
        .filter(news => news.date.startsWith(prefix))
        .map(news => news.date.slice(8, 10))
    )
    return Array.from(days).sort()
  }, [newsList, selectedYear, selectedMonth])

  // 过滤新闻列表
  const filteredNews = useMemo(() => {
    return newsList.filter(news => {
      // 搜索框过滤
      const matchesSearch = searchQuery === '' || 
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.date.includes(searchQuery)

      // 年份过滤
      const matchesYear = !selectedYear || news.date.startsWith(selectedYear)

      // 月份过滤
      const matchesMonth = !selectedMonth || news.date.slice(5, 7) === selectedMonth

      // 日期过滤
      const matchesDay = !selectedDay || news.date.slice(8, 10) === selectedDay

      return matchesSearch && matchesYear && matchesMonth && matchesDay
    })
  }, [newsList, searchQuery, selectedYear, selectedMonth, selectedDay])

  // 清除所有筛选
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedYear('')
    setSelectedMonth('')
    setSelectedDay('')
  }

  // 是否有筛选条件
  const hasFilters = searchQuery || selectedYear || selectedMonth || selectedDay

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* 标题 */}
      <header className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-black font-orbitron mb-4">
          <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            历史归档
          </span>
        </h1>
        <p className="text-gray-400">查看所有早报内容📚</p>
      </header>

      {/* 搜索和筛选区域 */}
      <div className="bg-card-bg border border-neon-blue/20 rounded-2xl p-6 mb-6">
        {/* 搜索框 */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="搜索标题、内容或日期..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-neon-blue focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 日期筛选 */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-neon-blue" />
            <span className="text-sm text-gray-400">日期筛选:</span>
          </div>

          {/* 年份选择 */}
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value)
              setSelectedMonth('')
              setSelectedDay('')
            }}
            className="px-3 py-2 bg-black/50 border border-gray-700 rounded-lg text-white text-sm focus:border-neon-blue focus:outline-none cursor-pointer hover:border-gray-600 transition-colors"
          >
            <option value="">选择年份</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}年</option>
            ))}
          </select>

          {/* 月份选择 */}
          <select
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value)
              setSelectedDay('')
            }}
            disabled={!selectedYear}
            className="px-3 py-2 bg-black/50 border border-gray-700 rounded-lg text-white text-sm focus:border-neon-blue focus:outline-none cursor-pointer hover:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">选择月份</option>
            {availableMonths.map(month => (
              <option key={month} value={month}>{parseInt(month)}月</option>
            ))}
          </select>

          {/* 日期选择 */}
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            disabled={!selectedYear || !selectedMonth}
            className="px-3 py-2 bg-black/50 border border-gray-700 rounded-lg text-white text-sm focus:border-neon-blue focus:outline-none cursor-pointer hover:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">选择日期</option>
            {availableDays.map(day => (
              <option key={day} value={day}>{parseInt(day)}日</option>
            ))}
          </select>

          {/* 清除筛选 */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto px-3 py-2 text-sm text-neon-blue hover:text-neon-pink transition-colors flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              清除筛选
            </button>
          )}
        </div>

        {/* 结果统计 */}
        <div className="mt-4 pt-4 border-t border-white/10 text-sm text-gray-500">
          共找到 <span className="text-neon-blue font-medium">{filteredNews.length}</span> 条记录
          {hasFilters && filteredNews.length !== newsList.length && (
            <span>（筛选自 {newsList.length} 条）</span>
          )}
        </div>
      </div>

      {/* 新闻列表 */}
      <div className="bg-card-bg border border-neon-blue/20 rounded-2xl p-6">
        {filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">未找到匹配的内容 📜</div>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-neon-blue hover:text-neon-pink transition-colors text-sm"
              >
                清除筛选条件
              </button>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-white/10">
            {filteredNews.map((news) => (
              <li key={news.id}>
                <Link
                  href={`/news/${news.date}`}
                  className="block py-5 px-4 -mx-4 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-white group-hover:text-neon-blue transition-colors mb-2">
                        {news.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{news.summary}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-500 ml-4 shrink-0">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm whitespace-nowrap">{formatDate(news.date)}</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
