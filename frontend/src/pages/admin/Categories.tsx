// Category Management Page
// Admin can create, edit, and delete categories

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Layout } from '../../components/layout/Layout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { BackToTop } from '../../components/ui/BackToTop'
import { categoriesAPI } from '../../api/categories'
import type { Category } from '../../types'

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    department: '',
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
      // Failed to fetch categories
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingCategory(null)
    setFormData({ name: '', description: '', department: '' })
    setShowModal(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      department: category.department || '',
    })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingCategory) {
        // Update existing category
        await categoriesAPI.update(editingCategory.id, formData)
        toast.success('Category updated successfully')
      } else {
        // Create new category
        await categoriesAPI.create(formData)
        toast.success('Category created successfully')
      }
      setShowModal(false)
      fetchCategories()
    } catch (error) {
      toast.error('Failed to save category')
    }
  }

  const handleDeleteClick = (id: string) => {
    setCategoryToDelete(id)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return

    setDeleteLoading(true)
    try {
      await categoriesAPI.delete(categoryToDelete)
      toast.success('Category deleted successfully')
      fetchCategories()
      setShowDeleteDialog(false)
      setCategoryToDelete(null)
    } catch (error) {
      toast.error('Failed to delete category')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Category Management</h2>
          <p className="text-slate-500 mt-1">Manage complaint categories</p>
        </div>
        <Button onClick={handleCreate}>
          <span className="material-symbols-outlined mr-2">add</span>
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full p-8 text-center">
            <p className="text-slate-600">No categories yet. Create your first one!</p>
          </div>
        ) : (
          categories.map((category) => (
            <Card key={category.id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <span className="material-symbols-outlined">category</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-1 text-slate-400 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(category.id)}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-2">{category.name}</h3>
              
              {category.description && (
                <p className="text-sm text-slate-600 mb-3">{category.description}</p>
              )}
              
              {category.department && (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="material-symbols-outlined text-[18px]">business</span>
                  {category.department}
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  {category._count?.tickets || 0} tickets
                </p>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Dormitory Issues"
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this category"
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g., Housing Department"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingCategory ? 'Update' : 'Create'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false)
          setCategoryToDelete(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleteLoading}
      />

      {/* Back to Top Button */}
      <BackToTop />
    </Layout>
  )
}
