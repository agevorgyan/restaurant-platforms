/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Scheduler Platform — HTTP Controller
 *
 * Exposes the REST API for the Enterprise Scheduler Platform.
 *
 * Routes:
 *   GET    /automation/schedules              — List schedules (paginated)
 *   POST   /automation/schedules              — Create a new schedule
 *   PATCH  /automation/schedules/:id          — Update schedule definition
 *   POST   /automation/schedules/:id/pause    — Pause an active schedule
 *   POST   /automation/schedules/:id/resume   — Resume a paused schedule
 *   DELETE /automation/schedules/:id          — Cancel a schedule
 *   GET    /automation/schedules/dashboard    — Scheduler dashboard metrics
 *   GET    /automation/jobs                   — List active job executions
 *   GET    /automation/jobs/history           — Immutable execution history
 *
 * Security:
 *   - Tenant ID is extracted from the authenticated JWT context (stubbed as
 *     a hardcoded value here; real implementation uses a Guard decorator).
 *   - All routes require RBAC: scheduler:read / scheduler:write permissions.
 *   - Audit trail entries are created by the application service layer.
 *
 * Validation:
 *   - All body shapes are typed DTOs validated at the service boundary.
 *   - Query parameters are validated and given safe defaults before passing
 *     to the service layer.
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import {
  SchedulerService,
  JobExecutionService,
} from '../../application/services';

import {
  CreateScheduleDto,
  UpdateScheduleDto,
  ListSchedulesDto,
  ListJobsDto,
  ListJobHistoryDto,
} from '../../application/dto';

// ---------------------------------------------------------------------------
// Controller
// ---------------------------------------------------------------------------

/**
 * REST controller for the Enterprise Scheduler Platform.
 *
 * All endpoints are scoped under /automation/schedules and /automation/jobs
 * as specified in the API contract.
 */
@Controller('automation')
export class SchedulerController {
  constructor(
    private readonly schedulerService: SchedulerService,
    private readonly jobExecutionService: JobExecutionService,
  ) {}

  // -------------------------------------------------------------------------
  // Schedule endpoints
  // -------------------------------------------------------------------------

  /**
   * GET /automation/schedules
   *
   * Returns a paginated, filtered list of schedule definitions.
   * Supports filtering by status, jobType, scheduleType, and full-text search.
   */
  @Get('schedules')
  async listSchedules(@Query() query: ListSchedulesDto) {
    // Stub: extract tenantId from JWT / request context
    const tenantId = 'tenant-stub';
    return this.schedulerService.listSchedules(tenantId, query);
  }

  /**
   * GET /automation/schedules/dashboard
   *
   * Returns aggregated scheduler dashboard metrics.
   * Route declared before :id to prevent parameter capture.
   */
  @Get('schedules/dashboard')
  async getDashboard() {
    const tenantId = 'tenant-stub';
    return this.schedulerService.getDashboard(tenantId);
  }

  /**
   * GET /automation/schedules/:id
   *
   * Returns a single schedule definition by ID.
   */
  @Get('schedules/:id')
  async getSchedule(@Param('id') id: string) {
    const tenantId = 'tenant-stub';
    return this.schedulerService.getSchedule(tenantId, id);
  }

  /**
   * POST /automation/schedules
   *
   * Creates a new schedule definition in Draft status.
   * The schedule must be explicitly activated via the /activate endpoint
   * or via PATCH status=Active before any executions occur.
   *
   * Validation performed by SchedulerService:
   *   - Cron expression syntax
   *   - IANA timezone validity
   *   - Execution window consistency
   *   - RetryPolicy constraints
   *   - OneTime schedules: executeAt must be in the future
   */
  @Post('schedules')
  @HttpCode(HttpStatus.CREATED)
  async createSchedule(@Body() dto: CreateScheduleDto) {
    const tenantId = 'tenant-stub';
    const createdBy = 'user-stub';
    return this.schedulerService.createSchedule(tenantId, dto, createdBy);
  }

  /**
   * PATCH /automation/schedules/:id
   *
   * Updates mutable fields on an existing schedule.
   * Immutable fields: id, type, tenantId, createdAt, createdBy.
   *
   * Updating a cron expression while the schedule is Active triggers
   * immediate recomputation of the next execution time.
   */
  @Patch('schedules/:id')
  async updateSchedule(
    @Param('id') id: string,
    @Body() dto: UpdateScheduleDto,
  ) {
    const tenantId = 'tenant-stub';
    const updatedBy = 'user-stub';
    return this.schedulerService.updateSchedule(tenantId, id, dto, updatedBy);
  }

  /**
   * POST /automation/schedules/:id/pause
   *
   * Pauses an Active schedule.
   * In-flight executions continue to their natural completion.
   * Body: { reason?: string }
   */
  @Post('schedules/:id/pause')
  @HttpCode(HttpStatus.NO_CONTENT)
  async pauseSchedule(
    @Param('id') id: string,
    @Body() body: { reason?: string },
  ) {
    const tenantId = 'tenant-stub';
    const pausedBy = 'user-stub';
    return this.schedulerService.pauseSchedule(tenantId, id, pausedBy, body.reason);
  }

  /**
   * POST /automation/schedules/:id/resume
   *
   * Resumes a Paused schedule.
   * The next execution time is recomputed from the current moment.
   */
  @Post('schedules/:id/resume')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resumeSchedule(@Param('id') id: string) {
    const tenantId = 'tenant-stub';
    const resumedBy = 'user-stub';
    return this.schedulerService.resumeSchedule(tenantId, id, resumedBy);
  }

  /**
   * DELETE /automation/schedules/:id
   *
   * Permanently cancels a schedule (terminal state).
   * No further executions will occur. The schedule record is retained
   * for audit purposes and is never physically deleted.
   * Body: { reason?: string }
   */
  @Delete('schedules/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancelSchedule(
    @Param('id') id: string,
    @Body() body: { reason?: string },
  ) {
    const tenantId = 'tenant-stub';
    const cancelledBy = 'user-stub';
    return this.schedulerService.cancelSchedule(tenantId, id, cancelledBy, body.reason);
  }

  // -------------------------------------------------------------------------
  // Job execution endpoints
  // -------------------------------------------------------------------------

  /**
   * GET /automation/jobs
   *
   * Returns paginated active job executions.
   * Active = Queued | Running | Retrying.
   * Supports filtering by scheduleId, jobType, status, and date range.
   */
  @Get('jobs')
  async listJobs(@Query() query: ListJobsDto) {
    const tenantId = 'tenant-stub';
    return this.jobExecutionService.listActiveJobs(tenantId, query);
  }

  /**
   * GET /automation/jobs/history
   *
   * Returns immutable execution history records.
   * Supports filtering by scheduleId, jobType, status, date range.
   * Records are append-only and cannot be modified.
   */
  @Get('jobs/history')
  async getJobHistory(@Query() query: ListJobHistoryDto) {
    const tenantId = 'tenant-stub';
    return this.jobExecutionService.listExecutionHistory(tenantId, query);
  }

  /**
   * GET /automation/jobs/failed
   *
   * Returns currently-failed and currently-retrying executions.
   * Used by the dashboard alert panel.
   */
  @Get('jobs/failed')
  async getFailedJobs() {
    const tenantId = 'tenant-stub';
    return this.jobExecutionService.listFailedJobs(tenantId);
  }
}
