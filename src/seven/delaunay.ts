/*
 * @Author: SongQian
 * @LastEditors: SongQian
 * @Date: 2022/06/29 16:42
 * @eMail: onlylove117225594632vip.qq.com
 * @Description: 三维四面体生成
 */
import { Vertex3D, Tetrahedron, Surface } from './declare'

const EPSILON = 1.0 / 1048576.0;

const supertriangle = (vertices : Array<Vertex3D>) => {
  var xmin = Number.POSITIVE_INFINITY,
    ymin = Number.POSITIVE_INFINITY,
    xmax = Number.NEGATIVE_INFINITY,
    ymax = Number.NEGATIVE_INFINITY,
    i, dx, dy, dmax, xmid, ymid;

  for(i = vertices.length; i--; ) {
    if (vertices[i].x < xmin) xmin = vertices[i].x;
    if (vertices[i].x > xmax) xmax = vertices[i].x;
    if (vertices[i].y < ymin) ymin = vertices[i].y;
    if (vertices[i].y > ymax) ymax = vertices[i].y;
  }

  dx = xmax - xmin;
  dy = ymax - ymin;
  dmax = Math.max(dx, dy);
  xmid = xmin + dx * 0.5;
  ymid = ymin + dy * 0.5;

  return [
    [xmid - 20 * dmax, ymid -      dmax],
    [xmid            , ymid + 20 * dmax],
    [xmid + 20 * dmax, ymid -      dmax]
  ];
}

const circumcircle = (vertices: Array<Vertex3D>, i: number, j: number, k : number) => {
  var x1 = vertices[i].x,
      y1 = vertices[i].y,
      x2 = vertices[j].x,
      y2 = vertices[j].y,
      x3 = vertices[k].x,
      y3 = vertices[k].y,
      fabsy1y2 = Math.abs(y1 - y2),
      fabsy2y3 = Math.abs(y2 - y3),
      xc, yc, m1, m2, mx1, mx2, my1, my2, dx, dy;

  /* Check for coincident points */
  if(fabsy1y2 < EPSILON && fabsy2y3 < EPSILON)
    throw new Error("Eek! Coincident points!");

  if(fabsy1y2 < EPSILON) {
    m2  = -((x3 - x2) / (y3 - y2));
    mx2 = (x2 + x3) / 2.0;
    my2 = (y2 + y3) / 2.0;
    xc  = (x2 + x1) / 2.0;
    yc  = m2 * (xc - mx2) + my2;
  } else if(fabsy2y3 < EPSILON) {
    m1  = -((x2 - x1) / (y2 - y1));
    mx1 = (x1 + x2) / 2.0;
    my1 = (y1 + y2) / 2.0;
    xc  = (x3 + x2) / 2.0;
    yc  = m1 * (xc - mx1) + my1;
  } else {
    m1  = -((x2 - x1) / (y2 - y1));
    m2  = -((x3 - x2) / (y3 - y2));
    mx1 = (x1 + x2) / 2.0;
    mx2 = (x2 + x3) / 2.0;
    my1 = (y1 + y2) / 2.0;
    my2 = (y2 + y3) / 2.0;
    xc  = (m1 * mx1 - m2 * mx2 + my2 - my1) / (m1 - m2);
    yc  = (fabsy1y2 > fabsy2y3) ?
      m1 * (xc - mx1) + my1 :
      m2 * (xc - mx2) + my2;
  }

  dx = x2 - xc;
  dy = y2 - yc;
  return {i: i, j: j, k: k, x: xc, y: yc, r: dx * dx + dy * dy};
}

const dedup = (edges: Array<number>) => {
    var i, j, a, b, m, n;

    for(j = edges.length; j; ) {
      b = edges[--j];
      a = edges[--j];

      for(i = j; i; ) {
        n = edges[--i];
        m = edges[--i];

        if((a === m && b === n) || (a === n && b === m)) {
          edges.splice(j, 2);
          edges.splice(i, 2);
          break;
        }
      }
    }
}

export const Delaunay2d = (vertices: Array<Vertex3D>) => { 
  let n = vertices.length,
        i, j, indices, st, open, closed, edges, dx, dy, a, b, c;
  if (n < 3) { 
      return [];
  }
  vertices = Array.from(vertices);
  indices = new Array(n);

  for (i = n; i--;) {
      indices[i] = i;
  }

  indices.sort(function(i, j) {
      var diff = vertices[j].x - vertices[i].x;
      return diff !== 0 ? diff : i - j;
  });

  /* Next, find the vertices of the supertriangle (which contains all other
    * triangles), and append them onto the end of a (copy of) the vertex
    * array. */
  st = supertriangle(vertices);
  // vertices.push(st[0], st[1], st[2]);
  vertices.push(
    { x: st[0][0], y: st[0][1], z: 0 },
    { x: st[1][0], y: st[1][1], z: 0 },
    { x: st[2][0], y: st[2][1], z: 0 }
  )
    
  /* Initialize the open list (containing the supertriangle and nothing
    * else) and the closed list (which is empty since we havn't processed
    * any triangles yet). */
  open   = [circumcircle(vertices, n + 0, n + 1, n + 2)];
  closed = [];
  edges  = [];

  /* Incrementally add each vertex to the mesh. */
  for(i = indices.length; i--; edges.length = 0) {
    c = indices[i];

    /* For each open triangle, check to see if the current point is
      * inside it's circumcircle. If it is, remove the triangle and add
      * it's edges to an edge list. */
    for(j = open.length; j--; ) {
      /* If this point is to the right of this triangle's circumcircle,
        * then this triangle should never get checked again. Remove it
        * from the open list, add it to the closed list, and skip. */
      dx = vertices[c].x - open[j].x;
      if(dx > 0.0 && dx * dx > open[j].r) {
        closed.push(open[j]);
        open.splice(j, 1);
        continue;
      }

      /* If we're outside the circumcircle, skip this triangle. */
      dy = vertices[c].y - open[j].y;
      if(dx * dx + dy * dy - open[j].r > EPSILON)
        continue;

      /* Remove the triangle and add it's edges to the edge list. */
      edges.push(
        open[j].i, open[j].j,
        open[j].j, open[j].k,
        open[j].k, open[j].i
      );
      open.splice(j, 1);
    }

    /* Remove any doubled edges. */
    dedup(edges);

    /* Add a new triangle for each edge. */
    for(j = edges.length; j; ) {
      b = edges[--j];
      a = edges[--j];
      open.push(circumcircle(vertices, a, b, c));
    }
  }

  /* Copy any remaining open triangles to the closed list, and then
    * remove any triangles that share a vertex with the supertriangle,
    * building a list of triplets that represent triangles. */
  for(i = open.length; i--; )
      closed.push(open[i]);
  open.length = 0;
  let result = [];

  for(i = closed.length; i--; )
      if(closed[i].i < n && closed[i].j < n && closed[i].k < n)
          result.push(vertices[closed[i].i], vertices[closed[i].j], vertices[closed[i].k]);
  /* Yay, we're done! */
  return result;
}

type Node = { data: any, left: Node | null, right: Node | null, parent: Node | null, dimension: number };

const BinaryHeap = function (scoreFunction: Function) {
  const content : Array<any> = [];

  const push = (element: any) => {
    content.push(element);
    bubbleUp(content.length - 1);
  }

  const pop = () => {
    let result = content[0];
    let end = content.pop();
    if (content.length > 0) {
      content[0] = end;
      sinkDown(0);
    }
    return result;
  }

  const peek = () => content[0];

  const remove = (node: Node) => {
    var len = content.length
    for (var i = 0; i < len; i++) {
      if (content[i] == node) {
        var end = content.pop();
        if (i != len - 1) {
          content[i] = end;
          if (scoreFunction(end) < scoreFunction(node))
            bubbleUp(i);
          else
            sinkDown(i);
        }
        return;
      }
    }
    throw new Error("Node not found.");
  }

  const size = () => content.length;

  const at = (index: number) => content[index];

  const bubbleUp = (n: number) => {
    var element = content[n];
    while (n > 0) {
      var parentN = Math.floor((n + 1) / 2) - 1,
          parent = content[parentN];
      if (scoreFunction(element) < scoreFunction(parent)) {
        content[parentN] = element;
        content[n] = parent;
        n = parentN;
        continue;
      }
      break;
    }
  }

  const sinkDown = (n: number) => {
    let length = content.length, element = content[n], elemScore = scoreFunction(element);
    
    while(true) {
      let child2N = (n + 1) * 2, child1N = child2N - 1;
      let swap = null, child1Score;
      if (child1N < length) {
        let child1 = content[child1N];
        child1Score = scoreFunction(child1);
        if (child1Score < elemScore)
          swap = child1N;
      }

      if (child2N < length) {
        let child2 = content[child2N],
            child2Score = scoreFunction(child2);
        if (child2Score < (swap == null ? elemScore : child1Score)){
          swap = child2N;
        }
      }

      if (swap != null) {
        content[n] = content[swap];
        content[swap] = element;
        n = swap;
        continue;
      }

      break;
    }
  }

  return {
    push,
    pop,
    peek,
    remove,
    size,
    at,
    bubbleUp,
    sinkDown
  }
}

const kdTree = function (points: Array<Vertex3D>, metric: (a: Vertex3D, b: Vertex3D) => number, dimensions: ["x", "y"] | ["x", "y", "z"]) {
  let root: Node | null = null;

  const buildTree = (points: Array<Vertex3D>, depth: number, parent: Node | null) => {
    var dim = depth % dimensions.length,
      median,
      node;

    if (points.length === 0) {
      return null;
    }
    if (points.length === 1) {
      return Object.create({ data : points[0], dimension: dim, parent: parent, left: null, right: null });
    }

    points.sort(function (a, b) {
      return a[dimensions[dim]] - b[dimensions[dim]];
    });

    median = Math.floor(points.length / 2);
    node = Object.create({ data : points[median], dimension: dim, parent: parent, left: null, right: null });
    node.left = buildTree(points.slice(0, median), depth + 1, node);
    node.right = buildTree(points.slice(median + 1), depth + 1, node);
    return node;
  }

  const loadTree = (data: Node) => {
    // Just need to restore the `parent` parameter
    root = data;

    const restoreParent = (root: Node) => {
      if (root.left) {
        root.left.parent = root;
        restoreParent(root.left);
      }

      if (root.right) {
        root.right.parent = root;
        restoreParent(root.right);
      }
    }

    restoreParent(data);
  }

  if (!Array.isArray(points))
    loadTree(points);
  else
    root = buildTree(points, 0, null);

  const toJSON = (src: Node) => {

    if (!src) src = <Node>root;

    var dest = Object.create({ data: src.data, dimension: src.dimension, parent: null, left: null, right: null });

    if (src.left) dest.left = toJSON(src.left);

    if (src.right) dest.right = toJSON(src.right);
    
    return dest;
  };

  const insert = (point: any) => {
    
    const innerSearch = (node: Node | null, parent: Node | null) : Node | null => {

      if (node === null) {
        return parent;
      }

      let dimension = dimensions[node.dimension];
      if (point[dimension] < node.data[dimension]) {
        return innerSearch(node.left, node);
      }
      return innerSearch(node.right, node);
    }

    let insertPosition = innerSearch(root, null),
      newNode,
      dimension;

    if (insertPosition === null) {
      root = Object.create({ data: point, dimension: 0, parent: null, left: null, right: null });
      return;
    }

    newNode = Object.create({ data: point, dimension: (insertPosition.dimension + 1) % dimensions.length, parent: insertPosition, left: null, right: null });
    dimension = dimensions[insertPosition.dimension];

    if (point[dimension] < insertPosition.data[dimension]) {
      insertPosition.left = newNode;
    } else {
      insertPosition.right = newNode;
    }
  };

  const remove = (point: any) => {
    let node;
    const nodeSearch = (node: Node | null, parent?: Node) : Node | null => {
      if (node === null) {
        return null;
      }

      if (node.data === point) {
        return node;
      }

      let dimension = dimensions[node.dimension];

      if (point[dimension] < node.data[dimension]) {
        return nodeSearch(node.left, node);
      }
      return nodeSearch(node.right, node);
    }

    const removeNode = (node: Node) => {
      let nextNode, nextObj, pDimension;

      const findMin = (node: Node | null, dim: number) : Node | null => {
        let dimension, own, left, right, min;

        if (node === null) {
          return null;
        }

        dimension = dimensions[dim];

        if (node.dimension === dim) {
          if (node.left !== null) {
            return findMin(node.left, dim);
          }
          return node;
        }

        own = node.data[dimension];
        left = findMin(node.left, dim);
        right = findMin(node.right, dim);
        min = node;

        if (left !== null && left.data[dimension] < own) {
          min = left;
        }
        if (right !== null && right.data[dimension] < min.data[dimension]) {
          min = right;
        }
        return min;
      }

      if (node.left === null && node.right === null) {
        if (node.parent === null) {
          root = null;
          return;
        }

        pDimension = dimensions[node.parent.dimension];

        if (node.data[pDimension] < node.parent.data[pDimension]) {
          node.parent.left = null;
        } else {
          node.parent.right = null;
        }
        return;
      }

      if (node.right !== null) {
        nextNode = findMin(node.right, node.dimension);
        if (nextNode) {
          nextObj = nextNode.data;
          removeNode(nextNode);
          node.data = nextObj;
        }
      } else {
        nextNode = findMin(node.left, node.dimension);
        if (nextNode) {
          nextObj = nextNode.data;
          removeNode(nextNode);
          node.right = node.left;
          node.left = null;
          node.data = nextObj;
        }
      }
    }

    node = nodeSearch(root);

    if (node === null) { return; }

    removeNode(node);
  };

  const nearest = (point: Vertex3D, maxNodes: number, maxDistance ?: number) => {
    let i, result, bestNodes = BinaryHeap((e: any) => -e[1]);

    const nearestSearch = (node: Node) => {
      let bestChild,
        dimension = dimensions[node.dimension],
        ownDistance = metric(point, node.data),
        linearPoint = Object.create({}),
        linearDistance,
        otherChild,
        i;

      const saveNode = (node: Node, distance: number) => {
        bestNodes.push([node, distance]);
        if (bestNodes.size() > maxNodes) {
          bestNodes.pop();
        }
      }

      for (i = 0; i < dimensions.length; i += 1) {
        if (i === node.dimension) {
          linearPoint[dimensions[i]] = point[dimensions[i]];
        } else {
          linearPoint[dimensions[i]] = node.data[dimensions[i]];
        }
      }

      linearDistance = metric(linearPoint, node.data);

      if (node.right === null && node.left === null) {
        if (bestNodes.size() < maxNodes || ownDistance < bestNodes.peek()[1]) {
          saveNode(node, ownDistance);
        }
        return;
      }

      if (node.right === null) {
        bestChild = node.left;
      } else if (node.left === null) {
        bestChild = node.right;
      } else {
        if (point[dimension] < node.data[dimension]) {
          bestChild = node.left;
        } else {
          bestChild = node.right;
        }
      }

      nearestSearch(<Node>bestChild);

      if (bestNodes.size() < maxNodes || ownDistance < bestNodes.peek()[1]) {
        saveNode(node, ownDistance);
      }

      if (bestNodes.size() < maxNodes || Math.abs(linearDistance) < bestNodes.peek()[1]) {
        if (bestChild === node.left) {
          otherChild = node.right;
        } else {
          otherChild = node.left;
        }
        if (otherChild !== null) {
          nearestSearch(otherChild);
        }
      }
    }

    if (maxDistance) {
      for (i = 0; i < maxNodes; i += 1) {
        bestNodes.push([null, maxDistance]);
      }
    }

    if(root)
      nearestSearch(root);

    result = [];

    for (i = 0; i < Math.min(maxNodes, bestNodes.size()); i += 1) {
      if (bestNodes.at(i)[0]) {
        result.push([bestNodes.at(i)[0].data, bestNodes.at(i)[1]]);
      }
    }
    return result;
  };

  const balanceFactor = () => {
    const height = (node: Node | null) : number => {
      if (node === null) {
        return 0;
      }
      return Math.max(height(node.left), height(node.right)) + 1;
    }

    const count = (node: Node | null): number => {
      if (node === null) {
        return 0;
      }
      return count(node.left) + count(node.right) + 1;
    }

    return height(root) / (Math.log(count(root)) / Math.log(2));
  };

  return { toJSON, insert, remove, nearest, balanceFactor };
}

/**
 * @LastEditors: SongQian
 * @Date: 2022/08/05 17:34
 * @description: 三维Delaunay四面体剖分
 * @param {Array} vertices
 * @param {Vertex3D} point
 * @return {*}
 */
export const Delaunay3d = (vertices: Array<Vertex3D>) => {
  let ver = vertices.map(it => [it.x, it.y, it.z]).flat(2);
}