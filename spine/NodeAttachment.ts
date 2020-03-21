import { spine } from "esotericsoftware-spine";
import { mat4 } from "gl-matrix";
import { Camera } from "../engine";
import { Transform } from "../math";
import { INode } from "../nodes";
import { WebGLRenderer } from "../render";
import { SpineHelper } from "./SpineHelper";

export class NodeAttachment extends spine.RegionAttachment implements INode
{
	public readonly Name: string;
	private transform: Transform = new Transform();
	private colorMatrix: Transform = new Transform();
	private child: INode | undefined;
	private visible: boolean = true;

	/**
	 * Creates an instance of NodeAttachment.
	 */
	public constructor( name: string )
	{
		super( name );
		this.Name = name;
	}

	/**
	 *
	 */
	public SetMatrix( matrix: mat4 ): void
	{
		this.transform.Set( matrix );
	}

	/**
	 *
	 */
	public SetColor( matrix: mat4 ): void
	{
		this.colorMatrix.Set( matrix );
	}

	/**
	 *
	 */
	public SetChild( child: INode | undefined ): void
	{
		this.child = child;
	}

	/**
	 *
	 */
	public FindNode( name: string ): INode | undefined
	{
		return this.child?.FindNode( name );
	}

	/**
	 *
	 */
	public Render( renderer: WebGLRenderer, camera: Camera ): void
	{
		if( this.visible )
		{
			this.child?.Render( renderer, camera );
		}
	}

	/**
	 *
	 */
	public Update( deltaTime: number, transform: Transform, color: Transform ): void
	{
		this.transform.SetParent( transform );
		this.colorMatrix.SetParent( color );
		this.visible = SpineHelper.IsVisible( this.transform.Get(), this.colorMatrix.Get() );
		if( this.visible )
		{
			this.child?.Update( deltaTime, this.transform, this.colorMatrix );
		}
	}
}
