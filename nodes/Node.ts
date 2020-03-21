import { Camera } from "../engine";
import { Transform } from "../math";
import { WebGLRenderer } from "../render";
import { INode } from "./INode";

/**
 * Base node implementation. This is basically an empty shell of a node that can be used as a placeholders.
 * Extend this class if you need a leaf node and extend CompositeNode if your node has children.
 */
export class Node implements INode
{
	/** Name of this instance. Making this unique makes finding it later easier. */
	public readonly Name: string;

	/**
	 *
	 */
	public constructor( name: string )
	{
		this.Name = name;
	}

	/**
	 * Returns the first node it finds with the given name.
	 */
	public FindNode( name: string ): INode | undefined
	{
		return ( this.Name === name ) ? this : undefined;
	}

	/**
	 *
	 */
	public Render( renderer: WebGLRenderer, camera: Camera ): void
	{
	}

	/**
	 *
	 */
	public Update( deltaTime: number, transform: Transform, color: Transform ): void
	{
	}

}
