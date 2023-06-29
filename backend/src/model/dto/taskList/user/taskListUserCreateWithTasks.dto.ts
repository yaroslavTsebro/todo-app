import {TaskListCreateDto} from "../common/taskListCreateDto";
import {IsArray, IsOptional} from "class-validator";
import {Type} from "class-transformer";
import {TaskCreateWithTaskListDto} from "../../task/taskCreateWithTaskList.dto";

export class TaskListUserCreateWithTasksDto extends TaskListCreateDto {
  @IsOptional()
  @Type(() => TaskCreateWithTaskListDto)
  @IsArray()
  tasks: TaskCreateWithTaskListDto[] | null
}