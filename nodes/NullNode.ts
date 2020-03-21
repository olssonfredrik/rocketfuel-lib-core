import { Engine } from "../engine";
import { IJSONObject } from "../util";
import { Node } from "./Node";

export class NullNode
{
	public static readonly Instance = new Node( "NullNode" );

	/**
	 *
	 */
	public static Create( engine: Engine, config: IJSONObject ): Node
	{
		return NullNode.Instance;
	}
}
