import { IRepository } from '@saas/domain';
import { StaffMember } from '../aggregates/staff-member';
import { Role } from '../aggregates/role';
import { Shift } from '../aggregates/shift';
import { Schedule } from '../aggregates/schedule';
import { AttendanceRecord } from '../aggregates/attendance-record';

export type IStaffRepository = IRepository<StaffMember>;
export type IRoleRepository = IRepository<Role>;
export type IShiftRepository = IRepository<Shift>;
export type IScheduleRepository = IRepository<Schedule>;
export type IAttendanceRepository = IRepository<AttendanceRecord>;
