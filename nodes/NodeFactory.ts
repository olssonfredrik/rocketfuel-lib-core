import { Engine } from "../engine";
import { PixiParticleSystemNode, StatelessParticleSystemNode } from "../particles";
import { TextNode } from "../sdf";
import { SpineNode, StateSpineNode } from "../spine";
import { Asserts, IJSONObject, JSONUtil } from "../util";
import { AspectRatioScaleNode } from "./AspectRatioScaleNode";
import { ButtonNode } from "./ButtonNode";
import { CameraAlignmentNode } from "./CameraAlignmentNode";
import { ColorNode } from "./ColorNode";
import { CompositeNode } from "./CompositeNode";
import { DebugNode } from "./DebugNode";
import { FloatNode } from "./FloatNode";
import { INode } from "./INode";
import { InputConsumerNode } from "./InputConsumerNode";
import { InputNode } from "./InputNode";
import { InputSliderNode } from "./InputSliderNode";
import { NinePatchNode } from "./NinePatchNode";
import { NullNode } from "./NullNode";
import { SingleChildNode } from "./SingleChildNode";
import { SpriteNode } from "./SpriteNode";
import { TexturedQuadNode } from "./TexturedQuadNode";
import { TransformNode } from "./TransformNode";
import { TransformValueNode } from "./TransformValueNode";
import { ValueBooleanNode } from "./ValueBooleanNode";
import { ValueIndexNode } from "./ValueIndexNode";

export class NodeFactory
{
	private readonly createFunctions = new Map< string, ( engine: Engine, data: IJSONObject ) => INode >();

	/**
	 *
	 */
	public constructor()
	{
		this.Set( "AspectRatioScaleNode", AspectRatioScaleNode.Create );
		this.Set( "ButtonNode", ButtonNode.Create );
		this.Set( "CameraAlignmentNode", CameraAlignmentNode.Create );
		this.Set( "ColorNode", ColorNode.Create );
		this.Set( "CompositeNode", CompositeNode.Create );
		this.Set( "DebugNode", DebugNode.Create );
		this.Set( "FloatNode", FloatNode.Create );
		this.Set( "InputConsumerNode", InputConsumerNode.Create );
		this.Set( "InputNode", InputNode.Create );
		this.Set( "InputSliderNode", InputSliderNode.Create );
		this.Set( "NullNode", NullNode.Create );
		this.Set( "SingleChildNode", SingleChildNode.Create );
		this.Set( "SpineNode", SpineNode.Create );
		this.Set( "StatelessParticleSystemNode", StatelessParticleSystemNode.Create );
		this.Set( "PixiParticleSystemNode", PixiParticleSystemNode.Create );
		this.Set( "SpriteNode", SpriteNode.Create );
		this.Set( "StateSpineNode", StateSpineNode.Create );
		this.Set( "TextNode", TextNode.Create );
		this.Set( "TexturedQuadNode", TexturedQuadNode.Create );
		this.Set( "TransformNode", TransformNode.Create );
		this.Set( "TransformValueNode", TransformValueNode.Create );
		this.Set( "ValueBooleanNode", ValueBooleanNode.Create );
		this.Set( "ValueIndexNode", ValueIndexNode.Create );
		this.Set( "NinePatchNode", NinePatchNode.Create );
	}

	/**
	 *
	 */
	public Set( type: string, creator: ( engine: Engine, data: IJSONObject ) => INode )
	{
		this.createFunctions.set( type, creator );
	}

	/**
	 *
	 */
	public Create( engine: Engine, data: IJSONObject ): INode
	{
		if( data === null || data === undefined )
		{
			return NullNode.Instance;
		}

		const nodeType = JSONUtil.GetAssertedString( data, "NodeType" );
		const creator = this.createFunctions.get( nodeType );
		Asserts.AssertDefined( creator, "Unknown node type: \"" + nodeType + "\"" );

		return creator( engine, data );
	}
}
