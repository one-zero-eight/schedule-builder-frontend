import { SchemaIssue } from '../../../api/types';
import { CapacityIssueCard } from './CapacityIssueCard';
import { RoomIssueCard } from './RoomIssueCard';
import { TeacherIssueCard } from './TeacherIssueCard';
import { OutlookIssueCard } from './OutlookIssueCard';

export function IssueCard({
  issue,
  onIgnore,
  mode = 'ignore',
}: {
  issue: SchemaIssue;
  onIgnore?: () => void;
  mode?: 'ignore' | 'restore';
}) {
  if (issue.collision_type === 'capacity') {
    return <CapacityIssueCard issue={issue} onIgnore={onIgnore} mode={mode} />;
  }
  if (issue.collision_type === 'room') {
    return <RoomIssueCard issue={issue} onIgnore={onIgnore} mode={mode} />;
  }
  if (issue.collision_type === 'teacher') {
    return <TeacherIssueCard issue={issue} onIgnore={onIgnore} mode={mode} />;
  }
  if (issue.collision_type === 'outlook') {
    return <OutlookIssueCard issue={issue} onIgnore={onIgnore} mode={mode} />;
  }
}
