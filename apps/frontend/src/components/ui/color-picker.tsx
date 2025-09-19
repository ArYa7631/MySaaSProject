'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, Palette } from 'lucide-react'
import { cn } from '@/utils/cn'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
  className?: string
  placeholder?: string
}

// Predefined color palette
const PRESET_COLORS = [
  '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
  '#FF0000', '#FF6600', '#FFCC00', '#00FF00', '#00CCFF', '#0066FF',
  '#6600FF', '#FF00CC', '#FF3366', '#FF9933', '#FFFF00', '#66FF66',
  '#33CCFF', '#3366FF', '#9966FF', '#FF66CC', '#FF6666', '#FF9966',
  '#FFFF66', '#66FF99', '#66CCFF', '#6666FF', '#CC66FF', '#FF66FF'
]

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  label,
  className,
  placeholder = '#000000'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const [isValidColor, setIsValidColor] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  // Update input value when prop value changes
  useEffect(() => {
    setInputValue(value)
  }, [value])

  const validateColor = (color: string) => {
    // Allow hex colors (#fff, #ffffff)
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    
    // Allow linear gradients (basic validation)
    const gradientPattern = /^linear-gradient\(.*\)$/
    
    // Allow CSS color names (basic validation)
    const cssColorPattern = /^[a-zA-Z]+$/
    
    return hexPattern.test(color) || gradientPattern.test(color) || cssColorPattern.test(color)
  }

  const handleColorChange = (color: string) => {
    setInputValue(color)
    setIsValidColor(validateColor(color))
    
    if (validateColor(color)) {
      onChange(color)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value
    setInputValue(color)
    setIsValidColor(validateColor(color))
    
    // Always call onChange to keep form data in sync
    // The form validation will handle invalid colors
    onChange(color)
  }

  const handleInputBlur = () => {
    if (!isValidColor && inputValue) {
      // Reset to previous valid value if input is invalid
      setInputValue(value)
      setIsValidColor(true)
      onChange(value) // Also reset the form field
    }
  }

  const handlePresetColorClick = (color: string) => {
    handleColorChange(color)
    setIsOpen(false)
  }

  const handleNativeColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value
    handleColorChange(color)
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label>{label}</Label>}
      
      <div className="flex items-center space-x-2">
        {/* Color Input */}
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className={cn(
            'flex-1',
            !isValidColor && 'border-red-500 focus:border-red-500'
          )}
        />
        
        {/* Color Picker Popover */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 p-0 border-2"
              style={{ 
                backgroundColor: value || '#000000',
                borderColor: value || '#000000'
              }}
            >
              <Palette className="h-4 w-4 text-white drop-shadow-sm" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              {/* Native Color Picker */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Choose Color</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={value || '#000000'}
                    onChange={handleNativeColorChange}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer bg-transparent"
                    style={{ 
                      WebkitAppearance: 'none',
                      appearance: 'none',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  />
                  <span className="text-sm text-gray-600">Use color picker</span>
                </div>
              </div>

              {/* Preset Colors */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Preset Colors</Label>
                <div className="grid grid-cols-6 gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => handlePresetColorClick(color)}
                      className={cn(
                        'w-8 h-8 rounded border-2 cursor-pointer transition-all hover:scale-110',
                        value === color ? 'border-gray-800 ring-2 ring-gray-400' : 'border-gray-300'
                      )}
                      style={{ backgroundColor: color }}
                      title={color}
                    >
                      {value === color && (
                        <Check className="w-4 h-4 text-white drop-shadow-sm mx-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Color Display */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Current Color</Label>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-8 h-8 border border-gray-300 rounded"
                    style={{ backgroundColor: value || '#000000' }}
                  />
                  <span className="text-sm font-mono">{value || placeholder}</span>
                </div>
              </div>

              {/* Validation Error */}
              {!isValidColor && inputValue && (
                <div className="text-sm text-red-600">
                  Invalid color format. Please use hex (#FF0000), gradient (linear-gradient(...)), or CSS color name (red)
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
