import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Slider } from './ui/slider';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Skeleton } from './ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  FileText, 
  Download, 
  Settings, 
  ChevronDown, 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  User,
  Calendar,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  Share
} from 'lucide-react';

export function ComponentLibrary() {
  const [sliderValue, setSliderValue] = useState([30]);
  const [progressValue, setProgressValue] = useState(65);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  const componentSections = [
    {
      title: "Buttons & Actions",
      components: [
        {
          name: "Primary Button",
          code: `<Button className="bg-primary hover:bg-primary-dark text-primary-foreground font-medium text-sm px-4 py-2 rounded-md">
  Primary Action
</Button>`,
          preview: (
            <Button className="bg-primary hover:bg-primary-dark text-primary-foreground font-medium text-sm px-4 py-2 rounded-md" style={{ fontFamily: 'Inter, sans-serif' }}>
              Primary Action
            </Button>
          )
        },
        {
          name: "Outline Button",
          code: `<Button 
  variant="outline" 
  className="border-gray-300 text-foreground hover:bg-gray-50 font-medium text-sm px-4 py-2 rounded-md"
>
  Secondary Action
</Button>`,
          preview: (
            <Button 
              variant="outline" 
              className="border-gray-300 text-foreground hover:bg-gray-50 font-medium text-sm px-4 py-2 rounded-md"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Secondary Action
            </Button>
          )
        },
        {
          name: "Icon Button",
          code: `<Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
  <Settings className="h-4 w-4" />
</Button>`,
          preview: (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
              <Settings className="h-4 w-4" />
            </Button>
          )
        },
        {
          name: "Button with Icon",
          code: `<Button className="bg-primary hover:bg-primary-dark text-primary-foreground font-medium text-sm px-4 py-2 rounded-md">
  <Download className="h-4 w-4 mr-2" />
  Download
</Button>`,
          preview: (
            <Button className="bg-primary hover:bg-primary-dark text-primary-foreground font-medium text-sm px-4 py-2 rounded-md" style={{ fontFamily: 'Inter, sans-serif' }}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )
        }
      ]
    },
    {
      title: "Form Elements",
      components: [
        {
          name: "Text Input",
          code: `<Input 
  type="text" 
  placeholder="Enter text here" 
  className="w-full border-gray-300"
/>`,
          preview: (
            <Input 
              type="text" 
              placeholder="Enter text here" 
              className="w-full border-gray-300"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
          )
        },
        {
          name: "Textarea",
          code: `<Textarea 
  placeholder="Enter your message" 
  className="w-full border-gray-300"
/>`,
          preview: (
            <Textarea 
              placeholder="Enter your message" 
              className="w-full border-gray-300"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
          )
        },
        {
          name: "Select Dropdown",
          code: `<Select>
  <SelectTrigger className="w-full border-gray-300">
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>`,
          preview: (
            <Select>
              <SelectTrigger className="w-full border-gray-300" style={{ fontFamily: 'Inter, sans-serif' }}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          )
        },
        {
          name: "Switch",
          code: `<Switch 
  checked={switchChecked} 
  onCheckedChange={setSwitchChecked} 
/>`,
          preview: (
            <div className="flex items-center space-x-2">
              <Switch 
                checked={switchChecked} 
                onCheckedChange={setSwitchChecked} 
              />
              <span className="text-body" style={{ fontFamily: 'Inter, sans-serif' }}>Enable notifications</span>
            </div>
          )
        },
        {
          name: "Checkbox",
          code: `<Checkbox 
  checked={checkboxChecked}
  onCheckedChange={setCheckboxChecked}
/>`,
          preview: (
            <div className="flex items-center space-x-2">
              <Checkbox 
                checked={checkboxChecked}
                onCheckedChange={setCheckboxChecked}
              />
              <span className="text-body" style={{ fontFamily: 'Inter, sans-serif' }}>I agree to the terms</span>
            </div>
          )
        },
        {
          name: "Radio Group",
          code: `<RadioGroup defaultValue="option1">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option1" />
    <label>Option 1</label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option2" />
    <label>Option 2</label>
  </div>
</RadioGroup>`,
          preview: (
            <RadioGroup defaultValue="option1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option1" />
                <label className="text-body" style={{ fontFamily: 'Inter, sans-serif' }}>Option 1</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option2" />
                <label className="text-body" style={{ fontFamily: 'Inter, sans-serif' }}>Option 2</label>
              </div>
            </RadioGroup>
          )
        }
      ]
    },
    {
      title: "Status & Feedback",
      components: [
        {
          name: "Status Badges",
          code: `<Badge className="bg-accent-green text-white text-xs font-medium px-3 py-1 rounded-full">
  Completed
</Badge>
<Badge className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
  Active
</Badge>
<Badge className="bg-gray-500 text-white text-xs font-medium px-3 py-1 rounded-full">
  Inactive
</Badge>`,
          preview: (
            <div className="flex gap-2">
              <Badge className="bg-accent-green text-white text-xs font-medium px-3 py-1 rounded-full" style={{ fontFamily: 'Inter, sans-serif' }}>
                Completed
              </Badge>
              <Badge className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full" style={{ fontFamily: 'Inter, sans-serif' }}>
                Active
              </Badge>
              <Badge className="bg-gray-500 text-white text-xs font-medium px-3 py-1 rounded-full" style={{ fontFamily: 'Inter, sans-serif' }}>
                Inactive
              </Badge>
            </div>
          )
        },
        {
          name: "Progress Bar",
          code: `<Progress value={65} className="w-full" />`,
          preview: (
            <div className="space-y-2">
              <Progress value={progressValue} className="w-full" />
              <div className="text-muted text-right" style={{ fontFamily: 'Inter, sans-serif' }}>{progressValue}%</div>
            </div>
          )
        },
        {
          name: "Alert Messages",
          code: `<Alert className="border-blue-200 bg-blue-50">
  <Info className="h-4 w-4" />
  <AlertDescription>
    This is an informational alert message.
  </AlertDescription>
</Alert>`,
          preview: (
            <div className="space-y-3">
              <Alert className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800" style={{ fontFamily: 'Inter, sans-serif' }}>
                  This is an informational alert message.
                </AlertDescription>
              </Alert>
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Success! Your action was completed.
                </AlertDescription>
              </Alert>
            </div>
          )
        },
        {
          name: "Loading Skeleton",
          code: `<div className="space-y-2">
  <Skeleton className="h-4 w-3/4" />
  <Skeleton className="h-4 w-1/2" />
  <Skeleton className="h-4 w-2/3" />
</div>`,
          preview: (
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          )
        }
      ]
    },
    {
      title: "Interactive Elements",
      components: [
        {
          name: "Slider",
          code: `<Slider
  value={sliderValue}
  onValueChange={setSliderValue}
  max={100}
  step={1}
  className="w-full"
/>`,
          preview: (
            <div className="space-y-2">
              <Slider
                value={sliderValue}
                onValueChange={setSliderValue}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="text-muted text-center" style={{ fontFamily: 'Inter, sans-serif' }}>Value: {sliderValue[0]}</div>
            </div>
          )
        },
        {
          name: "Tabs",
          code: `<Tabs defaultValue="tab1" className="w-full">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>`,
          preview: (
            <Tabs defaultValue="tab1" className="w-full">
              <TabsList>
                <TabsTrigger value="tab1" style={{ fontFamily: 'Inter, sans-serif' }}>Overview</TabsTrigger>
                <TabsTrigger value="tab2" style={{ fontFamily: 'Inter, sans-serif' }}>Details</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1" className="text-body" style={{ fontFamily: 'Inter, sans-serif' }}>
                Overview content goes here.
              </TabsContent>
              <TabsContent value="tab2" className="text-body" style={{ fontFamily: 'Inter, sans-serif' }}>
                Detail information is displayed here.
              </TabsContent>
            </Tabs>
          )
        },
        {
          name: "Dropdown Menu",
          code: `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">
      Actions <ChevronDown className="h-4 w-4 ml-2" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
          preview: (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-gray-300" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Actions <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem style={{ fontFamily: 'Inter, sans-serif' }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem style={{ fontFamily: 'Inter, sans-serif' }}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem style={{ fontFamily: 'Inter, sans-serif' }}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
        {
          name: "Modal Dialog",
          code: `<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description goes here</DialogDescription>
    </DialogHeader>
    <p>Dialog content goes here.</p>
  </DialogContent>
</Dialog>`,
          preview: (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary-dark text-primary-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Open Dialog
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle style={{ fontFamily: 'Inter, sans-serif' }}>Example Dialog</DialogTitle>
                  <DialogDescription style={{ fontFamily: 'Inter, sans-serif' }}>
                    This is a description of the dialog content
                  </DialogDescription>
                </DialogHeader>
                <p className="text-body" style={{ fontFamily: 'Inter, sans-serif' }}>
                  This is an example dialog with standard LiquidSpace styling.
                </p>
              </DialogContent>
            </Dialog>
          )
        }
      ]
    },
    {
      title: "Display Elements",
      components: [
        {
          name: "Avatar",
          code: `<Avatar>
  <AvatarImage src="/placeholder-avatar.jpg" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>`,
          preview: (
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>JD</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback className="bg-accent-green text-white" style={{ fontFamily: 'Inter, sans-serif' }}>SM</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback className="bg-accent-orange text-white" style={{ fontFamily: 'Inter, sans-serif' }}>KL</AvatarFallback>
              </Avatar>
            </div>
          )
        },
        {
          name: "Tooltip",
          code: `<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline">Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Helpful tooltip text</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>`,
          preview: (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="border-gray-300" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Hover me
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p style={{ fontFamily: 'Inter, sans-serif' }}>Helpful tooltip text</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        },
        {
          name: "Popover",
          code: `<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    <p>Popover content goes here.</p>
  </PopoverContent>
</Popover>`,
          preview: (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="border-gray-300" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Open Popover
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="space-y-2">
                  <h4 className="text-heading-2" style={{ fontFamily: 'Inter, sans-serif' }}>Quick Actions</h4>
                  <p className="text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Choose an action to perform.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-primary text-primary-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-300" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Share className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-heading-1 font-bold mb-2" style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}>
                Component Library
              </h1>
              <p className="text-primary-foreground/90 text-base font-normal" style={{ fontFamily: 'Inter, sans-serif' }}>
                Complete collection of UI components with code examples
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-medium text-sm px-4 py-2 rounded-md"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-8 space-y-12">
        {componentSections.map((section) => (
          <div key={section.title} className="space-y-6">
            {/* Section Header */}
            <div className="border-l-4 border-primary pl-6">
              <h2 className="text-heading-2 text-foreground font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                {section.title}
              </h2>
              <p className="text-muted mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                {section.title} components with proper LiquidSpace styling
              </p>
            </div>

            {/* Components Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {section.components.map((component, index) => (
                <Card key={index} className="bg-white rounded-xl shadow-card border-0">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="border-b border-gray-200 pb-4">
                        <h3 className="text-heading-2 text-foreground font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {component.name}
                        </h3>
                      </div>

                      {/* Preview */}
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-center min-h-16">
                          {component.preview}
                        </div>
                      </div>

                      {/* Code */}
                      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm text-gray-100" style={{ fontFamily: 'Monaco, Menlo, monospace' }}>
                          <code>{component.code}</code>
                        </pre>
                      </div>

                      {/* Copy Button */}
                      <div className="flex justify-end">
                        <Button 
                          size="sm"
                          variant="outline"
                          className="border-gray-300 text-foreground hover:bg-gray-50 font-medium text-sm px-3 py-1 rounded-md"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                          onClick={() => navigator.clipboard.writeText(component.code)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy Code
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Usage Guidelines */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <Card className="bg-white rounded-xl shadow-card border-0">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="h-6 w-6 text-primary" />
                <h3 className="text-heading-2 text-foreground font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Usage Guidelines
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-body font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Component Standards
                  </h4>
                  <ul className="space-y-2 text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <li>• Always use the Inter font family</li>
                    <li>• Apply consistent spacing using 8px grid system</li>
                    <li>• Use primary blue (#005B94) for actions</li>
                    <li>• Maintain proper contrast ratios</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="text-body font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Implementation Notes
                  </h4>
                  <ul className="space-y-2 text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <li>• Override default component styling explicitly</li>
                    <li>• Use design tokens from globals.css</li>
                    <li>• Test components in both light and dark modes</li>
                    <li>• Ensure keyboard accessibility</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-semibold text-blue-800 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Design System Integration
                    </h5>
                    <p className="text-sm text-blue-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                      All components follow the LiquidSpace Workplace Manager design system. Reference the Style Guide for color usage, typography, and spacing guidelines.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}