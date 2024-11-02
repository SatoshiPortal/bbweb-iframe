import { useContext } from "react"
import { Link } from "react-router-dom"
import { LanguageContext } from "../context/language.js"

import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  ChatBubbleLeftEllipsisIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Home() {
  const language = useContext(LanguageContext);

  const actions = [
    {
      title: language.home.buyBtnTitle,
      description: language.home.buyBtnSubtitle,
      path: '/buy',
      icon: ArrowDownLeftIcon,
      iconForeground: 'text-red-700 dark:text-white',
      iconBackground: 'bg-red-200',
    },
    {
      title: language.home.sellBtnTitle,
      description: language.home.sellBtnSubtitle,
      path: '/sell',
      icon: ArrowUpRightIcon,
      iconForeground: 'text-red-700 dark:text-white',
      iconBackground: 'bg-red-200',
    },
    {
      title: language.home.contactBtnTitle,
      description: language.home.contactBtnSubtitle,
      path: '/support',
      icon: ChatBubbleLeftEllipsisIcon,
      iconForeground: 'text-red-700 dark:text-white',
      iconBackground: 'bg-red-200',
    },
    {
      title: language.home.priceBtnTitle,
      description: language.home.priceBtnSubtitle,
      path: '/rates',
      icon: ChartBarIcon,
      iconForeground: 'text-red-700 dark:text-white',
      iconBackground: 'bg-red-200',
    },
  ]

  return (
    <div className="divide-y divide-gray-300 overflow-hidden rounded-lg bg-gray-300 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
      {actions.map((action, actionIdx) => (
        <div
          key={action.title}
          className={classNames(
            actionIdx === 0 ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none' : '',
            actionIdx === 1 ? 'sm:rounded-tr-lg' : '',
            actionIdx === actions.length - 2 ? 'sm:rounded-bl-lg' : '',
            actionIdx === actions.length - 1 ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none' : '',
            'group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-500'
          )}
        >
          <div>
            <span
              className={classNames(
                action.iconBackground,
                action.iconForeground,
                'inline-flex rounded-lg p-3'
              )}
            >
              <action.icon className="h-6 w-6" aria-hidden="true" />
            </span>
          </div>
          <div className="mt-2 sm:mt-8">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              <Link to={action.path} className="focus:outline-none">
                {/* Extend touch target to entire panel */}
                <span className="absolute inset-0" aria-hidden="true" />
                {action.title}
              </Link>
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {action.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
