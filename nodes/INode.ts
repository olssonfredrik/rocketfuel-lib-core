import { Camera } from "../engine";
import { Transform } from "../math";
import { WebGLRenderer } from "../render";

export interface INode
{
	readonly Name: string;

	/**
	 * Returns the first node it finds with the given name.
	 */
	FindNode( name: string ): INode | undefined;

	/**
	 *
	 */
	Render( renderer: WebGLRenderer, camera: Camera ): void;

	/**
	 *
	 */
	Update( deltaTime: number, transform: Transform, color: Transform ): void;
}
