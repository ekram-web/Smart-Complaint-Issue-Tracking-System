import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Layout } from '../../components/layout/Layout'
import { Card } from '../../components/ui/Card'
import { ticketsAPI } from '../../api/tickets'
import { categoriesAPI } from '../../api/categories'
import { uploadsAPI } from '../../api/uploads'
import type { Category, TicketPriority } from '../../types'

export function CreateTicket() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    description: '',
    location: '',
    priority: 'MEDIUM' as TicketPriority,
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll()
      if (response.success && response.data) {
        setCategories(response.data)
      }
    } catch (error) {
      toast.error('Failed to load categories')
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.title || formData.title.length < 5) {
      toast.error('Title must be at least 5 characters')
      return
    }
    if (!formData.description || formData.description.length < 10) {
      toast.error('Description must be at least 10 characters')
      return
    }
    if (!formData.categoryId) {
      toast.error('Please select a category')
      return
    }
    
    setLoading(true)

    try {
      // Create ticket first
      const response = await ticketsAPI.create(formData)
      if (response.success && response.data) {
        const ticketId = response.data.id

        // Upload files if any
        if (selectedFiles.length > 0) {
          toast.loading('Uploading attachments...', { id: 'upload' })
          for (const file of selectedFiles) {
            try {
              await uploadsAPI.uploadToTicket(ticketId, file)
            } catch (uploadError) {
              // Failed to upload file
            }
          }
          toast.success('Attachments uploaded', { id: 'upload' })
        }

        toast.success('Ticket created successfully!')
        navigate('/dashboard')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create ticket')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      // Limit to 5MB per file
      const validFiles = files.filter((file) => file.size <= 5 * 1024 * 1024)
      if (validFiles.length < files.length) {
        toast.error('Some files were too large (max 5MB per file)')
      }
      setSelectedFiles((prev) => [...prev, ...validFiles])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    toast.success('File removed')
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto pb-0">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <a href="/dashboard" className="hover:text-primary flex items-center gap-1">
            <span className="material-symbols-outlined text-base">dashboard</span>
            Dashboard
          </a>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900 dark:text-white font-semibold">Create Ticket</span>
        </nav>

        <Card className="mb-0">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Report a New Issue
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Fill in the details below. Our support team will get back to you as soon as possible.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Complaint Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Wi-Fi connectivity in Library"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Category
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Location of Issue
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Block 5, Room 204 or Main Campus Gate"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Detailed Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide as much detail as possible to help us resolve the issue..."
                rows={4}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Priority Level
              </label>
              <div className="grid grid-cols-3 gap-4">
                {(['LOW', 'MEDIUM', 'HIGH'] as TicketPriority[]).map((priority) => (
                  <label key={priority} className="cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value={priority}
                      checked={formData.priority === priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value as TicketPriority })
                      }
                      className="sr-only peer"
                    />
                    <div className="flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all">
                      <span className="text-sm font-medium">{priority}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Attachments (Optional)
              </label>
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <span className="material-symbols-outlined text-4xl text-slate-400">
                    cloud_upload
                  </span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-slate-500">Images or PDF (max 5MB per file)</p>
                </label>
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-600">
                          {file.type.startsWith('image/') ? 'image' : 'description'}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {file.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-4 pb-0">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-8 py-3 rounded-lg text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-10 py-3 bg-primary text-white rounded-lg font-bold text-sm shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  )
}
