import { INode } from "../nodes";
import { Asserts } from "./Asserts";

export class NodeUtil
{
	/**
	 *
	 */
	public static AssertedFindNode< T extends INode >( node: INode, name: string ): T
	{
		const child = node.FindNode( name ) as T;
		Asserts.AssertNotNull( child, "Failed to find node \"" + name + "\" as a child of \"" + node.Name + "\"" );
		return child;
	}
}
