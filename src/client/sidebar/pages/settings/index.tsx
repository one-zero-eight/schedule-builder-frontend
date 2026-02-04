import { useEffect, useState } from 'react';
import {
  SchemaOverride,
  SchemaSemesterOptionsInput,
  SchemaSemesterOptionsOutput,
  SchemaTarget,
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
import { TeacherInfo } from '../../components/TeacherInfo';
import useToken from '../../hooks/useToken';

export function SettingsPage() {
  const { token } = useToken();
  const [semester, setSemester] = useState<SchemaSemesterOptionsOutput | null>(
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
    core_courses_spreadsheet_id: null,
    core_courses_targets: [],
    electives_spreadsheet_id: null,
  });

  // Teachers form state
  const [teachersText, setTeachersText] = useState('');

  // Target editing state
  const [editingTargetIndex, setEditingTargetIndex] = useState<number | null>(
    null
  );
  const [targetForm, setTargetForm] = useState<SchemaTarget>({
    sheet_name: '',
    start_date: '',
    end_date: '',
    override: [],
  });

  // Override editing state (within a target)
  const [editingOverrideIndex, setEditingOverrideIndex] = useState<number | null>(null);
  const [overrideForm, setOverrideForm] = useState<SchemaOverride>({
    groups: [''],
    courses: [''],
    start_date: '',
    end_date: '',
  });

  // Sheet names for autocomplete
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [loadingSheetNames, setLoadingSheetNames] = useState(false);

  // Which spreadsheet ID is being set (shows loader)
  const [settingSpreadsheetId, setSettingSpreadsheetId] = useState<'core_courses' | 'electives' | null>(null);

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
        setSemesterForm({
          name: semesterResult.payload.name,
          core_courses_spreadsheet_id: semesterResult.payload.core_courses_spreadsheet_id,
          core_courses_targets: semesterResult.payload.core_courses_targets || [],
          electives_spreadsheet_id: semesterResult.payload.electives_spreadsheet_id,
        });
      }

      if (teachersResult.success && teachersResult.payload) {
        setTeachers(teachersResult.payload);
        const tsvData = teachersResult.payload.data
          .map(
            (t) =>
              `${t.name}\t${t.email || ''}\t${t.alias || ''}\t${t.student_group || ''}`
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
    loadSheetNames();
  }, []);

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
          text: `Teachers updated successfully. ${result.payload.data.length} teachers processed.`,
        });
        setTeachers(result.payload);
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

  const loadSheetNames = async () => {
    console.log('loadSheetNames');
    setLoadingSheetNames(true);
    try {
      const names = await serverFunctions.getSheetNames();
      setSheetNames(names);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load sheet names' });
    } finally {
      setLoadingSheetNames(false);
    }
  };

  const setCurrentSpreadsheetId = async (field: 'core_courses' | 'electives') => {
    setSettingSpreadsheetId(field);
    try {
      const spreadsheetId = await serverFunctions.getSpreadsheetID();
      setSemesterForm((prev) => ({
        ...prev,
        [field === 'core_courses' ? 'core_courses_spreadsheet_id' : 'electives_spreadsheet_id']: spreadsheetId,
      }));
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to get current spreadsheet ID' });
    } finally {
      setSettingSpreadsheetId(null);
    }
  };

  const startEditingSemester = async () => {
    if (semester) {
      setSemesterForm({
        name: semester.name,
        core_courses_spreadsheet_id: semester.core_courses_spreadsheet_id,
        core_courses_targets: semester.core_courses_targets || [],
        electives_spreadsheet_id: semester.electives_spreadsheet_id,
      });
    }
    setEditingSemester(true);
  };

  const startEditingTeachers = () => {
    if (teachers) {
      const tsvData = teachers.data
        .map(
          (t) =>
            `${t.name}\t${t.email || ''}\t${t.alias || ''}\t${t.student_group || ''}`
        )
        .join('\n');
      setTeachersText(tsvData);
    }
    setEditingTeachers(true);
  };

  const cancelEditingSemester = () => {
    setEditingSemester(false);
    if (semester) {
      setSemesterForm({
        name: semester.name,
        core_courses_spreadsheet_id: semester.core_courses_spreadsheet_id,
        core_courses_targets: semester.core_courses_targets || [],
        electives_spreadsheet_id: semester.electives_spreadsheet_id,
      });
    }
    setEditingTargetIndex(null);
    setEditingOverrideIndex(null);
  };

  const cancelEditingTeachers = () => {
    setEditingTeachers(false);
    if (teachers) {
      const tsvData = teachers.data
        .map(
          (t) =>
            `${t.name}\t${t.email || ''}\t${t.alias || ''}\t${t.student_group || ''}`
        )
        .join('\n');
      setTeachersText(tsvData);
    }
  };

  // Target management functions
  const addTarget = () => {
    setTargetForm({
      sheet_name: '',
      start_date: '',
      end_date: '',
      override: [],
    });
    setEditingTargetIndex(semesterForm.core_courses_targets.length);
    setSemesterForm((prev) => ({
      ...prev,
      core_courses_targets: [
        ...prev.core_courses_targets,
        { sheet_name: '', start_date: '', end_date: '', override: [] },
      ],
    }));
  };

  const editTarget = (index: number) => {
    const target = semesterForm.core_courses_targets[index];
    setTargetForm({ ...target });
    setEditingTargetIndex(index);
    setEditingOverrideIndex(null);
  };

  const saveTarget = () => {
    if (editingTargetIndex !== null) {
      setSemesterForm((prev) => ({
        ...prev,
        core_courses_targets: prev.core_courses_targets.map((item, index) =>
          index === editingTargetIndex
            ? {
                sheet_name: targetForm.sheet_name,
                start_date: targetForm.start_date,
                end_date: targetForm.end_date,
                override: targetForm.override,
              }
            : item
        ),
      }));
      setEditingTargetIndex(null);
      setTargetForm({
        sheet_name: '',
        start_date: '',
        end_date: '',
        override: [],
      });
    }
  };

  const cancelTarget = () => {
    setEditingTargetIndex(null);
    setEditingOverrideIndex(null);
    setTargetForm({
      sheet_name: '',
      start_date: '',
      end_date: '',
      override: [],
    });
  };

  const removeTarget = (index: number) => {
    setSemesterForm((prev) => ({
      ...prev,
      core_courses_targets: prev.core_courses_targets.filter((_, i) => i !== index),
    }));
  };

  // Override management functions (within a target)
  const addOverride = () => {
    setOverrideForm({
      groups: [''],
      courses: [''],
      start_date: '',
      end_date: '',
    });
    setEditingOverrideIndex(targetForm.override.length);
    setTargetForm((prev) => ({
      ...prev,
      override: [
        ...prev.override,
        { groups: [''], courses: [''], start_date: '', end_date: '' },
      ],
    }));
  };

  const editOverride = (index: number) => {
    const override = targetForm.override[index];
    setOverrideForm({ ...override });
    setEditingOverrideIndex(index);
  };

  const saveOverride = () => {
    if (editingOverrideIndex !== null) {
      setTargetForm((prev) => ({
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
    setTargetForm((prev) => ({
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
      courses: prev.courses.map((course, i) => (i === courseIndex ? value : course)),
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

      {/* Semester Configuration */}
      <div className="bg-white rounded-lg shadow p-4 min-w-0 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Semester Settings</h3>
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
                  setSemesterForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Fall 2024"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Core Courses Spreadsheet ID
              </label>
              <input
                type="text"
                value={semesterForm.core_courses_spreadsheet_id || ''}
                onChange={(e) =>
                  setSemesterForm((prev) => ({
                    ...prev,
                    core_courses_spreadsheet_id: e.target.value || null,
                  }))
                }
                className="w-full min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-hidden text-ellipsis"
                placeholder="Google Spreadsheet ID"
                title={semesterForm.core_courses_spreadsheet_id || undefined}
              />
              <button
                type="button"
                onClick={() => setCurrentSpreadsheetId('core_courses')}
                disabled={settingSpreadsheetId !== null}
                className="mt-1 ml-2 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-70"
              >
                {settingSpreadsheetId === 'core_courses' ? (
                  <Spinner className="w-4 h-4 text-gray-500" />
                ) : (
                  'set current'
                )}
              </button>
            </div>

            {/* Core Courses Targets */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700">
                Core Courses Targets
              </h4>

              {semesterForm.core_courses_targets.length > 0 && (
                <div className="space-y-3">
                  {semesterForm.core_courses_targets.map((target, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Target {index + 1}
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => editTarget(index)}
                            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => removeTarget(index)}
                            className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {editingTargetIndex === index ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Sheet Name
                            </label>
                            <input
                              type="text"
                              list={`sheet-names-${index}`}
                              value={targetForm.sheet_name}
                              onChange={(e) =>
                                setTargetForm((prev) => ({
                                  ...prev,
                                  sheet_name: e.target.value,
                                }))
                              }
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Sheet name"
                              required
                            />
                            {sheetNames.length > 0 && (
                              <datalist id={`sheet-names-${index}`}>
                                {sheetNames.map((name) => (
                                  <option key={name} value={name} />
                                ))}
                              </datalist>
                            )}
                            {loadingSheetNames && (
                              <p className="text-xs text-gray-500 mt-1">Loading sheet names...</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Start Date
                            </label>
                            <input
                              type="date"
                              value={targetForm.start_date}
                              onChange={(e) =>
                                setTargetForm((prev) => ({
                                  ...prev,
                                  start_date: e.target.value,
                                }))
                              }
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              End Date
                            </label>
                            <input
                              type="date"
                              value={targetForm.end_date}
                              onChange={(e) =>
                                setTargetForm((prev) => ({
                                  ...prev,
                                  end_date: e.target.value,
                                }))
                              }
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              required
                            />
                          </div>

                          {/* Overrides within Target */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <h5 className="text-xs font-medium text-gray-600">
                                Overrides
                              </h5>
                              <button
                                type="button"
                                onClick={addOverride}
                                className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                              >
                                + Add Override
                              </button>
                            </div>

                            {targetForm.override.length > 0 && (
                              <div className="space-y-2">
                                {targetForm.override.map((override, overrideIndex) => (
                                  <div
                                    key={overrideIndex}
                                    className="p-2 bg-gray-50 rounded border border-gray-200"
                                  >
                                    {editingOverrideIndex === overrideIndex ? (
                                      <div className="space-y-2">
                                        <div>
                                          <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Groups
                                          </label>
                                          <div className="space-y-1">
                                            {overrideForm.groups.map(
                                              (group, groupIndex) => (
                                                <div
                                                  key={groupIndex}
                                                  className="flex gap-1"
                                                >
                                                  <input
                                                    type="text"
                                                    value={group}
                                                    onChange={(e) =>
                                                      updateGroup(
                                                        groupIndex,
                                                        e.target.value
                                                      )
                                                    }
                                                    className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                                                    placeholder="Group name"
                                                  />
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      removeGroup(groupIndex)
                                                    }
                                                    className="px-1 py-1 text-xs bg-red-500 text-white rounded"
                                                  >
                                                    ×
                                                  </button>
                                                </div>
                                              )
                                            )}
                                            <button
                                              type="button"
                                              onClick={addGroup}
                                              className="px-2 py-1 text-xs bg-gray-400 text-white rounded"
                                            >
                                              + Add Group
                                            </button>
                                          </div>
                                        </div>

                                        <div>
                                          <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Courses
                                          </label>
                                          <div className="space-y-1">
                                            {overrideForm.courses.map(
                                              (course, courseIndex) => (
                                                <div
                                                  key={courseIndex}
                                                  className="flex gap-1"
                                                >
                                                  <input
                                                    type="text"
                                                    value={course}
                                                    onChange={(e) =>
                                                      updateCourse(
                                                        courseIndex,
                                                        e.target.value
                                                      )
                                                    }
                                                    className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                                                    placeholder="Course name"
                                                  />
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      removeCourse(courseIndex)
                                                    }
                                                    className="px-1 py-1 text-xs bg-red-500 text-white rounded"
                                                  >
                                                    ×
                                                  </button>
                                                </div>
                                              )
                                            )}
                                            <button
                                              type="button"
                                              onClick={addCourse}
                                              className="px-2 py-1 text-xs bg-gray-400 text-white rounded"
                                            >
                                              + Add Course
                                            </button>
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                              Start Date
                                            </label>
                                            <input
                                              type="datetime-local"
                                              value={overrideForm.start_date}
                                              onChange={(e) =>
                                                setOverrideForm((prev) => ({
                                                  ...prev,
                                                  start_date: e.target.value,
                                                }))
                                              }
                                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                              End Date
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
                                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                            />
                                          </div>
                                        </div>

                                        <div className="flex gap-2">
                                          <button
                                            type="button"
                                            onClick={saveOverride}
                                            className="px-2 py-1 text-xs bg-green-600 text-white rounded"
                                          >
                                            Save Override
                                          </button>
                                          <button
                                            type="button"
                                            onClick={cancelOverride}
                                            className="px-2 py-1 text-xs bg-gray-500 text-white rounded"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="text-xs text-gray-600">
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <div>
                                              <strong>Groups:</strong>{' '}
                                              {override.groups.length > 0
                                                ? override.groups.join(', ')
                                                : 'None'}
                                            </div>
                                            <div>
                                              <strong>Courses:</strong>{' '}
                                              {override.courses.length > 0
                                                ? override.courses.join(', ')
                                                : 'None'}
                                            </div>
                                            <div>
                                              <strong>Period:</strong>{' '}
                                              {override.start_date} to{' '}
                                              {override.end_date}
                                            </div>
                                          </div>
                                          <div className="flex gap-1">
                                            <button
                                              type="button"
                                              onClick={() =>
                                                editOverride(overrideIndex)
                                              }
                                              className="px-1 py-1 text-xs bg-blue-500 text-white rounded"
                                            >
                                              Edit
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                removeOverride(overrideIndex)
                                              }
                                              className="px-1 py-1 text-xs bg-red-500 text-white rounded"
                                            >
                                              ×
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={saveTarget}
                              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              Save Target
                            </button>
                            <button
                              type="button"
                              onClick={cancelTarget}
                              className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600">
                          <div>
                            <strong>Sheet:</strong> {target.sheet_name}
                          </div>
                          <div>
                            <strong>Start:</strong> {target.start_date}
                          </div>
                          <div>
                            <strong>End:</strong> {target.end_date}
                          </div>
                          {target.override && target.override.length > 0 && (
                            <div className="mt-1">
                              <strong>Overrides:</strong> {target.override.length}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {semesterForm.core_courses_targets.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No targets configured. Click{' '}
                  <button
                    type="button"
                    onClick={addTarget}
                    className="text-primary underline hover:text-secondary"
                  >
                    Add Target
                  </button>{' '}
                  to add one.
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  Click{' '}
                  <button
                    type="button"
                    onClick={addTarget}
                    className="text-primary underline hover:text-secondary"
                  >
                    Add Target
                  </button>{' '}
                  to add another.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Electives Spreadsheet ID
              </label>
              <input
                type="text"
                value={semesterForm.electives_spreadsheet_id || ''}
                onChange={(e) =>
                  setSemesterForm((prev) => ({
                    ...prev,
                    electives_spreadsheet_id: e.target.value || null,
                  }))
                }
                className="w-full min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-hidden text-ellipsis"
                placeholder="Google Spreadsheet ID"
                title={semesterForm.electives_spreadsheet_id || undefined}
              />
              <button
                type="button"
                onClick={() => setCurrentSpreadsheetId('electives')}
                disabled={settingSpreadsheetId !== null}
                className="mt-1 ml-2 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-70"
              >
                {settingSpreadsheetId === 'electives' ? (
                  <Spinner className="w-4 h-4 text-gray-500" />
                ) : (
                  'set current'
                )}
              </button>
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
                <p className="text-sm text-gray-600">
                  <strong>{semester.name}</strong>
                </p>
                {semester.core_courses_spreadsheet_id && (
                  <p className="text-sm text-gray-600 mt-1 min-w-0 overflow-hidden">
                    <strong>Core Courses Spreadsheet:</strong>
                    <br />
                    <span className="truncate block" title={semester.core_courses_spreadsheet_id}>
                      {semester.core_courses_spreadsheet_id}
                    </span>
                  </p>
                )}
                {semester.electives_spreadsheet_id && (
                  <p className="text-sm text-gray-600 mt-1 flex gap-1 min-w-0 overflow-hidden">
                    <strong className="shrink-0">Electives Spreadsheet:</strong>
                    <span className="truncate min-w-0" title={semester.electives_spreadsheet_id}>
                      {semester.electives_spreadsheet_id}
                    </span>
                  </p>
                )}
                {semester.core_courses_targets &&
                  semester.core_courses_targets.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                        Core Courses Targets ({semester.core_courses_targets.length}):
                      </h5>
                      <div className="space-y-2">
                        {semester.core_courses_targets.map((target, index) => (
                          <div
                            key={index}
                            className="text-xs text-gray-600 p-2 bg-gray-100 rounded"
                          >
                            <div>
                              <strong>{target.sheet_name}</strong>
                            </div>
                            <div>
                              {target.start_date} to {target.end_date}
                            </div>
                            {target.override && target.override.length > 0 && (
                              <div className="mt-1">
                                <strong>Overrides:</strong> {target.override.length}
                              </div>
                            )}
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
          <h3 className="text-lg font-medium">Teachers Settings</h3>
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
                Teachers Data (TSV format, just copy from spreadsheet and paste)
              </label>
              <div className="overflow-x-auto border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
                <textarea
                  value={teachersText}
                  onChange={(e) => setTeachersText(e.target.value)}
                  className="min-w-[500px] w-full px-3 py-2 border-none focus:outline-none whitespace-pre resize-none"
                  rows={8}
                  placeholder={`Name\tEmail\tAlias\tStudent Group\nIvan Konyukhov\ti.konyukhov@innopolis.ru\t@ivankonyukhov\t\nArsen Mutalapov\ta.mutalapov@innopolis.university\t\tM25-SE-01`}
                  required
                />
              </div>
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
                    <TeacherInfo
                      key={index}
                      teacher={teacher}
                      className="text-sm text-gray-600 py-1 border-b border-gray-100"
                    />
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
