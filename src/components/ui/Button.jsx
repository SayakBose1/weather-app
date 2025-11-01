import React from 'react'

export default function Button({ children, className = '', onClick, ...props }) {
  return (
    <button
      onClick={onClick}
      className={
        'px-3 py-1 rounded-md shadow-sm border bg-white dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 ' +
        className
      }
      {...props}
    >
      {children}
    </button>
  )
}
