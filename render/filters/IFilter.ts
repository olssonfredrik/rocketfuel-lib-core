import { WebGLRenderer } from "../WebGLRenderer";

export interface IFilter
{
	Update( deltaTime: number ): void;
	Process( renderer: WebGLRenderer, input: string ): string;
}
