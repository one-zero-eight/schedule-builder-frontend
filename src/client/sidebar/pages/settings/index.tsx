import { useEffect, useState } from 'react';
import {
  SchemaSemesterOptionsInput,
  SchemaTeachersData,
} from '../../../api/types';
import {
  getSemesterOptions,
  getTeachersOptions,
  setSemesterOptions,
  setTeachersOptions,
} from '../../../lib/endpoints';
import { LoadingButton } from '../../components/LoadingButton';
import { Spinner } from '../../components/Spinner';
import useToken from '../../hooks/useToken';

export function SettingsPage() {
  const { token } = useToken();
  const [semester, setSemester] = useState<SchemaSemesterOptionsInput | null>(
    null
  );
  const [teachers, setTeachers] = useState<SchemaTeachersData | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Edit mode states
  const [editingSemester, setEditingSemester] = useState(false);
  const [editingTeachers, setEditingTeachers] = useState(false);

  // Semester form state
  const [semesterForm, setSemesterForm] = useState<SchemaSemesterOptionsInput>({
    name: '',
    start_date: '',
    end_date: '',
    override: [],
  });

  // Teachers form state
  const [teachersText, setTeachersText] = useState('');

  const loadData = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const [semesterResult, teachersResult] = await Promise.all([
        getSemesterOptions(token),
        getTeachersOptions(token),
      ]);

      if (semesterResult.success && semesterResult.payload) {
        setSemester(semesterResult.payload);
        setSemesterForm(semesterResult.payload);
      }

      if (teachersResult.success && teachersResult.payload) {
        setTeachers(teachersResult.payload);
        // Convert teachers to TSV format for editing
        const tsvData = teachersResult.payload.data
          .map(
            (t) =>
              `${t.name}\t${t.email || ''}\t${t.alias || ''}\t${
                t.student || ''
              }`
          )
          .join('\n');
        setTeachersText(tsvData);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const handleSemesterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    try {
      const result = await setSemesterOptions(semesterForm, token);
      if (result.success) {
        setSemester(result.payload);
        setMessage({ type: 'success', text: 'Semester updated successfully' });
        setEditingSemester(false);
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update semester' });
    } finally {
      setLoading(false);
    }
  };

  const handleTeachersSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !teachersText.trim()) return;

    setLoading(true);
    try {
      const result = await setTeachersOptions(teachersText, token);
      if (result.success) {
        setMessage({
          type: 'success',
          text: `Teachers updated successfully. ${result.payload} teachers processed.`,
        });
        // Reload teachers data
        const teachersResult = await getTeachersOptions(token);
        if (teachersResult.success && teachersResult.payload) {
          setTeachers(teachersResult.payload);
        }
        setEditingTeachers(false);
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update teachers' });
    } finally {
      setLoading(false);
    }
  };

  const clearMessage = () => setMessage(null);

  const startEditingSemester = () => {
    if (semester) {
      setSemesterForm(semester);
    }
    setEditingSemester(true);
  };

  const startEditingTeachers = () => {
    if (teachers) {
      const tsvData = teachers.data
        .map(
          (t) =>
            `${t.name}\t${t.email || ''}\t${t.alias || ''}\t${t.student || ''}`
        )
        .join('\n');
      setTeachersText(tsvData);
    }
    setEditingTeachers(true);
  };

  const cancelEditingSemester = () => {
    setEditingSemester(false);
    if (semester) {
      setSemesterForm(semester);
    }
  };

  const cancelEditingTeachers = () => {
    setEditingTeachers(false);
    if (teachers) {
      const tsvData = teachers.data
        .map(
          (t) =>
            `${t.name}\t${t.email || ''}\t${t.alias || ''}\t${t.student || ''}`
        )
        .join('\n');
      setTeachersText(tsvData);
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-center">Settings</h2>
        <div className="text-center text-textSecondary">
          <p>Please provide an API token to access settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <h2 className="text-xl font-semibold text-center">Settings</h2>

      {message && (
        <div
          className={`p-3 rounded-md ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          <div className="flex justify-between items-center">
            <span>{message.text}</span>
            <button onClick={clearMessage} className="text-sm font-bold">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Semester Configuration */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Semester Configuration</h3>
          {!editingSemester && (
            <button
              onClick={startEditingSemester}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Edit
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-4">
            <Spinner />
          </div>
        ) : editingSemester ? (
          <form onSubmit={handleSemesterSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Semester Name
              </label>
              <input
                type="text"
                value={semesterForm.name}
                onChange={(e) =>
                  setSemesterForm((prev: SchemaSemesterOptionsInput) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Fall 2024"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={semesterForm.start_date}
                  onChange={(e) =>
                    setSemesterForm((prev: SchemaSemesterOptionsInput) => ({
                      ...prev,
                      start_date: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={semesterForm.end_date}
                  onChange={(e) =>
                    setSemesterForm((prev: SchemaSemesterOptionsInput) => ({
                      ...prev,
                      end_date: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2">
              <LoadingButton
                type="submit"
                isLoading={loading}
                loadingText="Updating..."
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Save
              </LoadingButton>
              <button
                type="button"
                onClick={cancelEditingSemester}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="p-3 bg-gray-50 rounded-md">
            {semester ? (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Current Semester:
                </h4>
                <p className="text-sm text-gray-600">
                  <strong>{semester.name}</strong> ({semester.start_date} to{' '}
                  {semester.end_date})
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No semester configured</p>
            )}
          </div>
        )}
      </div>

      {/* Teachers Configuration */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Teachers Configuration</h3>
          {!editingTeachers && (
            <button
              onClick={startEditingTeachers}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Edit
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-4">
            <Spinner />
          </div>
        ) : editingTeachers ? (
          <form onSubmit={handleTeachersSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teachers Data (TSV format)
              </label>
              <textarea
                value={teachersText}
                onChange={(e) => setTeachersText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={8}
                placeholder="Name&#9;Email&#9;Alias&#9;Student&#10;John Doe&#9;john@example.com&#9;jdoe&#9;&#10;Jane Smith&#9;jane@example.com&#9;jsmith&#9;"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: Name (tab) Email (tab) Alias (tab) Student
                <br />
                Use tab characters to separate fields. Leave fields empty if not
                applicable.
              </p>
            </div>

            <div className="flex gap-2">
              <LoadingButton
                type="submit"
                isLoading={loading}
                loadingText="Updating..."
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Save
              </LoadingButton>
              <button
                type="button"
                onClick={cancelEditingTeachers}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="p-3 bg-gray-50 rounded-md">
            {teachers && teachers.data.length > 0 ? (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Current Teachers ({teachers.data.length}):
                </h4>
                <div className="max-h-40 overflow-y-auto">
                  {teachers.data.map((teacher, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-600 py-1 border-b border-gray-100"
                    >
                      <strong>{teacher.name}</strong>
                      {teacher.email && ` • ${teacher.email}`}
                      {teacher.alias && ` • ${teacher.alias}`}
                      {teacher.student && ` • Student: ${teacher.student}`}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No teachers configured</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
