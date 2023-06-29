import {IsNumber, IsPositive} from "class-validator";
import {
  TaskListUserCreateWithTasksDto
} from "../user/taskListUserCreateWithTasks.dto";

export class TaskListGroupCreateWithTasksDto extends TaskListUserCreateWithTasksDto {
  @IsNumber()
  @IsPositive()
  groupId: number;
}