import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
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
import { serverFunctions } from '../../../lib/serverFunctions';
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
  const [editingSheetNames, setEditingSheetNames] = useState(false);

  // Sheet names configuration
  const [sheetNames, setSheetNames] = useLocalStorage<string[]>(
    'schedule-builder-sheet-names',
    ['1st block common (since 25/08)', 'Ru Programs']
  );
  const [availableSheetNames, setAvailableSheetNames] = useState<string[]>([]);

  // Semester form state
  const [semesterForm, setSemesterForm] = useState<SchemaSemesterOptionsInput>({
    name: '',
    start_date: '',
    end_date: '',
    override: [],
  });

  // Teachers form state
  const [teachersText, setTeachersText] = useState('');

  // Sheet names form state
  const [sheetNamesForm, setSheetNamesForm] = useState<string[]>([]);

  // Override form state
  const [overrideForm, setOverrideForm] = useState({
    groups: [''],
    courses: [''],
    start_date: '',
    end_date: '',
  });
  const [editingOverrideIndex, setEditingOverrideIndex] = useState<
    number | null
  >(null);

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

      // Load available sheet names from Google Sheets
      try {
        const sheetNamesResult = await serverFunctions.getAllSheetNames();
        setAvailableSheetNames(sheetNamesResult || []);
      } catch (error) {
        console.warn('Failed to load sheet names from Google Sheets:', error);
        setAvailableSheetNames([]);
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

  useEffect(() => {
    setSheetNamesForm([...sheetNames]);
  }, [sheetNames]);

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

  const startEditingSheetNames = () => {
    setSheetNamesForm([...sheetNames]);
    setEditingSheetNames(true);
  };

  const cancelEditingSheetNames = () => {
    setEditingSheetNames(false);
    setSheetNamesForm([...sheetNames]);
  };

  const handleSheetNamesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out empty values and ensure all names are valid
    const validSheetNames = sheetNamesForm.filter((name) => name.trim() !== '');
    setSheetNames(validSheetNames);
    setEditingSheetNames(false);
    setMessage({ type: 'success', text: 'Sheet names updated successfully' });
  };

  // Override management functions
  const addOverride = () => {
    setOverrideForm({
      groups: [''],
      courses: [''],
      start_date: '',
      end_date: '',
    });
    setEditingOverrideIndex(semesterForm.override.length);
    setSemesterForm((prev) => ({
      ...prev,
      override: [
        ...prev.override,
        { groups: [''], courses: [''], start_date: '', end_date: '' },
      ],
    }));
  };

  const editOverride = (index: number) => {
    const override = semesterForm.override[index];
    setOverrideForm({
      groups: [...override.groups],
      courses: [...override.courses],
      start_date: override.start_date,
      end_date: override.end_date,
    });
    setEditingOverrideIndex(index);
  };

  const saveOverride = () => {
    if (editingOverrideIndex !== null) {
      setSemesterForm((prev) => ({
        ...prev,
        override: prev.override.map((item, index) =>
          index === editingOverrideIndex
            ? {
                groups: overrideForm.groups.filter((g) => g.trim() !== ''),
                courses: overrideForm.courses.filter((c) => c.trim() !== ''),
                start_date: overrideForm.start_date,
                end_date: overrideForm.end_date,
              }
            : item
        ),
      }));
      setEditingOverrideIndex(null);
      setOverrideForm({
        groups: [''],
        courses: [''],
        start_date: '',
        end_date: '',
      });
    }
  };

  const cancelOverride = () => {
    setEditingOverrideIndex(null);
    setOverrideForm({
      groups: [''],
      courses: [''],
      start_date: '',
      end_date: '',
    });
  };

  const removeOverride = (index: number) => {
    setSemesterForm((prev) => ({
      ...prev,
      override: prev.override.filter((_, i) => i !== index),
    }));
  };

  const addGroup = () => {
    setOverrideForm((prev) => ({
      ...prev,
      groups: [...prev.groups, ''],
    }));
  };

  const removeGroup = (groupIndex: number) => {
    setOverrideForm((prev) => ({
      ...prev,
      groups: prev.groups.filter((_, i) => i !== groupIndex),
    }));
  };

  const updateGroup = (groupIndex: number, value: string) => {
    setOverrideForm((prev) => ({
      ...prev,
      groups: prev.groups.map((group, i) => (i === groupIndex ? value : group)),
    }));
  };

  const addCourse = () => {
    setOverrideForm((prev) => ({
      ...prev,
      courses: [...prev.courses, ''],
    }));
  };

  const removeCourse = (courseIndex: number) => {
    setOverrideForm((prev) => ({
      ...prev,
      courses: prev.courses.filter((_, i) => i !== courseIndex),
    }));
  };

  const updateCourse = (courseIndex: number, value: string) => {
    setOverrideForm((prev) => ({
      ...prev,
      courses: prev.courses.map((course, i) =>
        i === courseIndex ? value : course
      ),
    }));
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
    <div className="flex flex-col gap-3">
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

      {/* Sheet Names Configuration */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Sheet Names</h3>
          {!editingSheetNames && (
            <button
              onClick={startEditingSheetNames}
              className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Edit
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-4">
            <Spinner />
          </div>
        ) : editingSheetNames ? (
          <form onSubmit={handleSheetNamesSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selected Sheet Names
              </label>
              <div className="space-y-2">
                {sheetNamesForm.map((name, index) => (
                  <div key={index} className="flex gap-2">
                    <select
                      value={name}
                      onChange={(e) => {
                        const newForm = [...sheetNamesForm];
                        newForm[index] = e.target.value;
                        setSheetNamesForm(newForm);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Select a sheet --</option>
                      {availableSheetNames.map((availableName) => (
                        <option
                          key={availableName}
                          value={availableName}
                          disabled={
                            sheetNamesForm.includes(availableName) &&
                            availableName !== name
                          }
                        >
                          {availableName}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        const newForm = sheetNamesForm.filter(
                          (_, i) => i !== index
                        );
                        setSheetNamesForm(newForm);
                      }}
                      className="px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setSheetNamesForm([...sheetNamesForm, ''])}
                  className="px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  + Add Sheet
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Select sheet names from the dropdown. Available sheets are
                loaded from your Google Spreadsheet.
              </p>
            </div>

            <div className="flex gap-2">
              <LoadingButton
                type="submit"
                isLoading={loading}
                loadingText="Updating..."
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Save
              </LoadingButton>
              <button
                type="button"
                onClick={cancelEditingSheetNames}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium text-gray-900 mb-2">
              Selected sheets ({sheetNames.length}):
            </h4>
            {sheetNames.length > 0 ? (
              <div className="max-h-40 overflow-y-auto">
                {sheetNames.map((name, index) => (
                  <div
                    key={index}
                    className="text-sm text-gray-600 py-1 border-b border-gray-100"
                  >
                    {name}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No sheet names configured</p>
            )}
          </div>
        )}
      </div>

      {/* Semester Configuration */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Semester</h3>
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

            {/* Override Configuration */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-medium text-gray-700">Overrides</h4>
                <button
                  type="button"
                  onClick={addOverride}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Add Override
                </button>
              </div>

              {semesterForm.override.length > 0 && (
                <div className="space-y-3">
                  {semesterForm.override.map((override, index) => (
                    <div
                      key={index}
                      className="p-3 border border-gray-200 rounded-md"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Override {index + 1}
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => editOverride(index)}
                            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => removeOverride(index)}
                            className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {editingOverrideIndex === index ? (
                        <div className="space-y-3">
                          {/* Groups */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Groups
                            </label>
                            <div className="space-y-2">
                              {overrideForm.groups.map((group, groupIndex) => (
                                <div key={groupIndex} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={group}
                                    onChange={(e) =>
                                      updateGroup(groupIndex, e.target.value)
                                    }
                                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Group name"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeGroup(groupIndex)}
                                    className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={addGroup}
                                className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                              >
                                + Add Group
                              </button>
                            </div>
                          </div>

                          {/* Courses */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Courses
                            </label>
                            <div className="space-y-2">
                              {overrideForm.courses.map(
                                (course, courseIndex) => (
                                  <div key={courseIndex} className="flex gap-2">
                                    <input
                                      type="text"
                                      value={course}
                                      onChange={(e) =>
                                        updateCourse(
                                          courseIndex,
                                          e.target.value
                                        )
                                      }
                                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                      placeholder="Course name"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeCourse(courseIndex)}
                                      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                      ×
                                    </button>
                                  </div>
                                )
                              )}
                              <button
                                type="button"
                                onClick={addCourse}
                                className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                              >
                                + Add Course
                              </button>
                            </div>
                          </div>

                          {/* Override Dates */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Start date
                              </label>
                              <input
                                type="date"
                                value={overrideForm.start_date}
                                onChange={(e) =>
                                  setOverrideForm((prev) => ({
                                    ...prev,
                                    start_date: e.target.value,
                                  }))
                                }
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                End date
                              </label>
                              <input
                                type="date"
                                value={overrideForm.end_date}
                                onChange={(e) =>
                                  setOverrideForm((prev) => ({
                                    ...prev,
                                    end_date: e.target.value,
                                  }))
                                }
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={saveOverride}
                              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={cancelOverride}
                              className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600">
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <strong>Groups:</strong>{' '}
                              {override.groups.filter((g) => g.trim()).length >
                              0
                                ? override.groups
                                    .filter((g) => g.trim())
                                    .join(', ')
                                : 'None'}
                            </div>
                            <div>
                              <strong>Courses:</strong>{' '}
                              {override.courses.filter((c) => c.trim()).length >
                              0
                                ? override.courses
                                    .filter((c) => c.trim())
                                    .join(', ')
                                : 'None'}
                            </div>
                          </div>
                          <div className="mt-1">
                            <strong>Period:</strong> {override.start_date} to{' '}
                            {override.end_date}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {semesterForm.override.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No overrides configured. Click "Add Override" to add one.
                </p>
              )}
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

                {semester.override && semester.override.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      Overrides ({semester.override.length}):
                    </h5>
                    <div className="space-y-2">
                      {semester.override.map((override, index) => (
                        <div
                          key={index}
                          className="text-xs text-gray-600 p-2 bg-gray-100 rounded"
                        >
                          <div className="grid grid-cols-1 gap-2">
                            <div>
                              <strong>Groups:</strong>{' '}
                              {override.groups.filter((g) => g.trim()).length >
                              0
                                ? override.groups
                                    .filter((g) => g.trim())
                                    .join(', ')
                                : 'None'}
                            </div>
                            <div>
                              <strong>Courses:</strong>{' '}
                              {override.courses.filter((c) => c.trim()).length >
                              0
                                ? override.courses
                                    .filter((c) => c.trim())
                                    .join(', ')
                                : 'None'}
                            </div>
                          </div>
                          <div className="mt-1">
                            <strong>Period:</strong> {override.start_date} to{' '}
                            {override.end_date}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
          <h3 className="text-lg font-medium">Teachers</h3>
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
