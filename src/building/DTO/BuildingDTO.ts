import {ApiModelProperty} from '@nestjs/swagger';

export class BuildingDTO {
    @ApiModelProperty()
    name: string;

    @ApiModelProperty()
    provider: string;

    @ApiModelProperty({required: false})
    resourceId?: string;

    @ApiModelProperty({required: false})
    image?: string;
}
