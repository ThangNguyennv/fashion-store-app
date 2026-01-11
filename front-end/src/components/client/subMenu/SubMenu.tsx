import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IoChevronDown, IoChevronUp } from 'react-icons/io5'

interface Child {
  _id: string
  title: string
  slug: string
}

interface Sub {
  _id: string
  title: string
  slug: string
  children?: Child[]
}

interface Parent {
  _id: string
  title: string
  slug: string
  children?: Sub[]
}

interface SubMenuProps {
  dataDropdown: Parent[]
  items: string
  isMobile?: boolean
  onLinkClick?: () => void
  showParentLink?: boolean
  parentLinkPath?: string
  parentLinkText?: string
}

const SubMenu = ({
  dataDropdown,
  items,
  isMobile = false,
  onLinkClick,
  showParentLink = false,
  parentLinkPath = '',
  parentLinkText = ''
}: SubMenuProps) => {
  const [expandedParent, setExpandedParent] = useState<string | null>(null)
  const [expandedSub, setExpandedSub] = useState<string | null>(null)
  const [isMainExpanded, setIsMainExpanded] = useState(false)

  const toggleMain = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsMainExpanded(!isMainExpanded)
    if (!isMainExpanded) {
      setExpandedParent(null)
      setExpandedSub(null)
    }
  }

  const toggleParent = (parentId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setExpandedParent(expandedParent === parentId ? null : parentId)
    setExpandedSub(null)
  }

  const toggleSub = (subId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setExpandedSub(expandedSub === subId ? null : subId)
  }

  const handleLinkClick = () => {
    if (onLinkClick) onLinkClick()
  }

  // Desktop Version
  if (!isMobile) {
    return (
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[10px] p-[16px] md:p-[24px] bg-white shadow-lg w-full divide-x divide-black">
        {dataDropdown.map((parent) => (
          <div key={parent._id} className="px-3 md:px-4 first:pl-0 last:border-r-0">
            <Link
              to={`/${items}/${parent.slug}`}
              className="font-[600] uppercase mb-[10px] md:mb-[12px] border-b-[2px] border-black inline-block hover:text-[#FFAB19] transition-colors text-[13px] md:text-[15px] lg:text-[16px]"
            >
              {parent.title}
            </Link>
            <div className="mt-[6px] md:mt-[8px] space-y-[8px] md:space-y-[10px]">
              {parent.children?.map((sub) => (
                <div key={sub._id}>
                  <Link
                    to={`/${items}/${sub.slug}`}
                    className="font-semibold text-gray-800 hover:text-[#FFAB19] transition-colors block text-[12px] md:text-[14px] lg:text-[15px]"
                  >
                    {sub.title}
                  </Link>
                  {sub.children && sub.children.length > 0 && (
                    <ul className="ml-[10px] md:ml-[12px] mt-[8px] md:mt-[10px] text-gray-600 grid xl:grid-cols-2 grid-cols-1 gap-[12px] md:gap-[15px]">
                      {sub.children.map((child) => (
                        <li key={child._id}>
                          <Link
                            to={`/${items}/${child.slug}`}
                            className="hover:text-[#FFAB19] transition-colors text-[11px] md:text-[13px] lg:text-[14px]"
                          >
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Mobile Version - Accordion Style
  return (
    <div className="bg-white w-full">
      {/* Main Parent Link with Dropdown (nếu có showParentLink) */}
      {showParentLink && parentLinkPath && parentLinkText && (
        <div className="border-b border-gray-200">
          <div className="flex items-center w-full">
            <Link
              to={parentLinkPath}
              onClick={handleLinkClick}
              className="font-[600] uppercase text-[14px] sm:text-[15px] md:text-[16px] flex-1 py-3 px-4 hover:bg-[#E0F2FE] rounded-lg transition-colors"
            >
              {parentLinkText}
            </Link>
            <button
              onClick={toggleMain}
              className="p-3 sm:p-4 hover:bg-gray-50 transition-colors"
              aria-label="Toggle main menu"
            >
              {isMainExpanded ? (
                <IoChevronUp className="text-xl sm:text-2xl" />
              ) : (
                <IoChevronDown className="text-xl sm:text-2xl" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      {(!showParentLink || isMainExpanded) && dataDropdown.map((parent) => (
        <div key={parent._id} className="border-b border-gray-200">
          {/* Parent Level */}
          <div className="flex flex-col">
            <div className="flex items-center w-full bg-gray-50">
              <Link
                to={`/${items}/${parent.slug}`}
                onClick={handleLinkClick}
                className="font-[600] uppercase text-[13px] sm:text-[14px] md:text-[15px] flex-1 p-3 sm:p-4 hover:bg-gray-100 transition-colors"
              >
                {parent.title}
              </Link>
              {parent.children && parent.children.length > 0 && (
                <button
                  onClick={(e) => toggleParent(parent._id, e)}
                  className="p-3 sm:p-4 hover:bg-gray-100 transition-colors"
                  aria-label="Toggle submenu"
                >
                  {expandedParent === parent._id ? (
                    <IoChevronUp className="text-lg sm:text-xl" />
                  ) : (
                    <IoChevronDown className="text-lg sm:text-xl" />
                  )}
                </button>
              )}
            </div>

            {/* Sub Level */}
            {expandedParent === parent._id && parent.children && (
              <div className="bg-white pl-3 sm:pl-4">
                {parent.children.map((sub) => (
                  <div key={sub._id} className="border-t border-gray-100">
                    <div className="flex items-center w-full">
                      <Link
                        to={`/${items}/${sub.slug}`}
                        onClick={handleLinkClick}
                        className="font-semibold text-gray-800 text-[12px] sm:text-[13px] md:text-[14px] flex-1 p-2.5 sm:p-3 hover:bg-gray-50 transition-colors"
                      >
                        {sub.title}
                      </Link>
                      {sub.children && sub.children.length > 0 && (
                        <button
                          onClick={(e) => toggleSub(sub._id, e)}
                          className="p-2.5 sm:p-3 hover:bg-gray-50 transition-colors"
                          aria-label="Toggle child menu"
                        >
                          {expandedSub === sub._id ? (
                            <IoChevronUp className="text-base sm:text-lg" />
                          ) : (
                            <IoChevronDown className="text-base sm:text-lg" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Child Level */}
                    {expandedSub === sub._id && sub.children && (
                      <div className="bg-gray-50 pl-3 sm:pl-4">
                        {sub.children.map((child) => (
                          <Link
                            key={child._id}
                            to={`/${items}/${child.slug}`}
                            onClick={handleLinkClick}
                            className="block p-2.5 sm:p-3 text-gray-600 text-[11px] sm:text-[12px] md:text-[13px] hover:bg-white hover:text-[#FFAB19] transition-colors border-t border-gray-200"
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default SubMenu