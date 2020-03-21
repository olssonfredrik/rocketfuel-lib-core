import { Transform } from "../math";
import { Node } from "./Node";

export class LeafNode extends Node
{
	protected transform: Transform = new Transform();
	protected color: Transform = new Transform();

	/**
	 *
	 */
	public Update( deltaTime: number, transform: Transform, color: Transform ): void
	{
		this.transform = transform;
		this.color = color;
	}
}
