class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

class BST {
  constructor() {
    this.root = null;
  }

  insert(value) {
    const newNode = new Node(value);
    if (this.root === null) {
      this.root = newNode;
    } else {
      this._insertNode(this.root, newNode);
    }
  }

  _insertNode(node, newNode) {
    if (newNode.value < node.value) {
      if (node.left === null) {
        node.left = newNode;
        newNode.parent = node;
      } else {
        this._insertNode(node.left, newNode);
      }
    } else {
      if (node.right === null) {
        node.right = newNode;
        newNode.parent = node;
      } else {
        this._insertNode(node.right, newNode);
      }
    }
  }

  delete(value) {
    this.root = this._deleteNode(this.root, value);
  }

  _deleteNode(node, value) {
    if (node === null) return null;

    if (value < node.value) {
      node.left = this._deleteNode(node.left, value);
    } else if (value > node.value) {
      node.right = this._deleteNode(node.right, value);
    } else {
      if (node.left === null && node.right === null) return null;
      if (node.left === null) return node.right;
      if (node.right === null) return node.left;

      const tempNode = this._findMinNode(node.right);
      node.value = tempNode.value;
      node.right = this._deleteNode(node.right, tempNode.value);
    }
    return node;
  }

  _findMinNode(node) {
    while (node.left !== null) node = node.left;
    return node;
  }
}

class AVLNode extends Node {
  constructor(value) {
    super(value);
    this.height = 1;
  }
}

class AVLTree extends BST {
  constructor() {
    super();
  }

  insert(value) {
    this.root = this._insertNode(this.root, value);
  }

  _insertNode(node, value) {
    if (node === null) return new AVLNode(value);

    if (value < node.value) {
      node.left = this._insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = this._insertNode(node.right, value);
    } else {
      return node;
    }

    node.height = 1 + Math.max(this._getHeight(node.left), this._getHeight(node.right));
    return this._balance(node);
  }

  _getHeight(node) {
    if (node === null) return 0;
    return node.height;
  }

  _balance(node) {
    const balance = this._getBalance(node);
    if (balance > 1) {
      if (this._getBalance(node.left) < 0) node.left = this._leftRotate(node.left);
      return this._rightRotate(node);
    }
    if (balance < -1) {
      if (this._getBalance(node.right) > 0) node.right = this._rightRotate(node.right);
      return this._leftRotate(node);
    }
    return node;
  }

  _getBalance(node) {
    if (node === null) return 0;
    return this._getHeight(node.left) - this._getHeight(node.right);
  }

  _leftRotate(z) {
    const y = z.right;
    const T2 = y.left;
    y.left = z;
    z.right = T2;
    z.height = 1 + Math.max(this._getHeight(z.left), this._getHeight(z.right));
    y.height = 1 + Math.max(this._getHeight(y.left), this._getHeight(y.right));
    return y;
  }

  _rightRotate(y) {
    const x = y.left;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    y.height = 1 + Math.max(this._getHeight(y.left), this._getHeight(y.right));
    x.height = 1 + Math.max(this._getHeight(x.left), this._getHeight(x.right));
    return x;
  }
}

class RedBlackNode extends Node {
  constructor(value, color = 'red') {
    super(value);
    this.color = color; // 'red' or 'black'
  }
}

class RedBlackTree extends BST {
  constructor() {
    super();
    this.NIL = new RedBlackNode(null, 'black');
    this.root = this.NIL;
  }

  insert(value) {
    const newNode = new RedBlackNode(value);
    newNode.left = this.NIL;
    newNode.right = this.NIL;

    let y = null;
    let x = this.root;

    while (x !== this.NIL) {
      y = x;
      if (newNode.value < x.value) x = x.left;
      else x = x.right;
    }

    newNode.parent = y;

    if (y === null) {
      this.root = newNode;
    } else if (newNode.value < y.value) {
      y.left = newNode;
    } else {
      y.right = newNode;
    }

    newNode.color = 'red'; // New node is always red

    this._fixInsert(newNode);
  }

  _fixInsert(node) {
    while (node !== this.root && node.parent.color === 'red') {
      if (node.parent === node.parent.parent.left) {
        let uncle = node.parent.parent.right;
        if (uncle.color === 'red') {
          node.parent.color = 'black';
          uncle.color = 'black';
          node.parent.parent.color = 'red';
          node = node.parent.parent;
        } else {
          if (node === node.parent.right) {
            node = node.parent;
            this._leftRotate(node);
          }
          node.parent.color = 'black';
          node.parent.parent.color = 'red';
          this._rightRotate(node.parent.parent);
        }
      } else {
        let uncle = node.parent.parent.left;
        if (uncle.color === 'red') {
          node.parent.color = 'black';
          uncle.color = 'black';
          node.parent.parent.color = 'red';
          node = node.parent.parent;
        } else {
          if (node === node.parent.left) {
            node = node.parent;
            this._rightRotate(node);
          }
          node.parent.color = 'black';
          node.parent.parent.color = 'red';
          this._leftRotate(node.parent.parent);
        }
      }
    }
    this.root.color = 'black';
  }

  _leftRotate(node) {
    const y = node.right;
    node.right = y.left;
    if (y.left !== this.NIL) y.left.parent = node;
    y.parent = node.parent;
    if (node.parent === null) {
      this.root = y;
    } else if (node === node.parent.left) {
      node.parent.left = y;
    } else {
      node.parent.right = y;
    }
    y.left = node;
    node.parent = y;
  }

  _rightRotate(node) {
    const y = node.left;
    node.left = y.right;
    if (y.right !== this.NIL) y.right.parent = node;
    y.parent = node.parent;
    if (node.parent === null) {
      this.root = y;
    } else if (node === node.parent.right) {
      node.parent.right = y;
    } else {
      node.parent.left = y;
    }
    y.right = node;
    node.parent = y;
  }

  delete(value) {
    // Implement Red-Black Tree deletion
    this._deleteNode(this.root, value);
    this._fixDeletion(this.root);
  }

  _fixDeletion(node) {
    while (node !== this.root && node.color === 'black') {
      if (node === node.parent.left) {
        let sibling = node.parent.right;
        if (sibling.color === 'red') {
          sibling.color = 'black';
          node.parent.color = 'red';
          this._leftRotate(node.parent);
          sibling = node.parent.right;
        }
        if (sibling.left.color === 'black' && sibling.right.color === 'black') {
          sibling.color = 'red';
          node = node.parent;
        } else {
          if (sibling.right.color === 'black') {
            sibling.left.color = 'black';
            sibling.color = 'red';
            this._rightRotate(sibling);
            sibling = node.parent.right;
          }
          sibling.color = node.parent.color;
          node.parent.color = 'black';
          sibling.right.color = 'black';
          this._leftRotate(node.parent);
          node = this.root;
        }
      } else {
        // Symmetric case for the right side
        let sibling = node.parent.left;
        if (sibling.color === 'red') {
          sibling.color = 'black';
          node.parent.color = 'red';
          this._rightRotate(node.parent);
          sibling = node.parent.left;
        }
        if (sibling.right.color === 'black' && sibling.left.color === 'black') {
          sibling.color = 'red';
          node = node.parent;
        } else {
          if (sibling.left.color === 'black') {
            sibling.right.color = 'black';
            sibling.color = 'red';
            this._leftRotate(sibling);
            sibling = node.parent.left;
          }
          sibling.color = node.parent.color;
          node.parent.color = 'black';
          sibling.left.color = 'black';
          this._rightRotate(node.parent);
          node = this.root;
        }
      }
    }
    node.color = 'black';
  }
  
}

// Global variables
let tree = null;

// Initialize the selected tree type
function initializeTree() {
  const treeType = document.getElementById('treeType').value;
  if (treeType === 'bst') {
    tree = new BST();
  } else if (treeType === 'avl') {
    tree = new AVLTree();
  } else if (treeType === 'redBlack') {
    tree = new RedBlackTree();
  }
  renderTree();
}
// Reset the highlights and lines before a new traversal or operation
/*function resetTreeVisualization() {
  const nodes = document.querySelectorAll('.node');
  const lines = document.querySelectorAll('.line');
  
  nodes.forEach(node => {
    node.style.backgroundColor = 'lightblue'; // Reset color of the nodes
  });
  
  lines.forEach(line => {
    line.style.backgroundColor = 'black'; // Reset color of the lines
  });
}*/

// Render the tree
function renderTree() {
  document.getElementById('tree').innerHTML = '';
  visualizeTree(tree.root, window.innerWidth / 2, 50, 1);
}

// Visualize the tree
function visualizeTree(node, x, y, level) {
  const nodeSize = 40; // Size of the node
  const halfNodeSize = nodeSize / 2;

  if (node === null || node === tree.NIL) return; // Skip drawing for null or NIL nodes

  // Create node element
  const nodeElement = document.createElement('div');
  nodeElement.className = 'node';
  nodeElement.style.left = `${x - halfNodeSize}px`; // Center node horizontally
  nodeElement.style.top = `${y - halfNodeSize}px`;  // Center node vertically
  nodeElement.textContent = node.value;

  // Apply color for Red-Black Tree nodes
  if (node instanceof RedBlackNode) {
    nodeElement.style.backgroundColor = node.color === 'red' ? 'red' : 'black';
    nodeElement.style.color = 'white';
  }

  document.getElementById('tree').appendChild(nodeElement);

  // Only draw lines and continue visualization if the left or right child exists
  const xOffset = 100 / (level + 1);

  // Draw line and visualize the left child if it exists and is not NIL
  if (node.left !== null && node.left !== tree.NIL) {
    const x1 = x;
    const y1 = y;
    const x2 = x - xOffset;
    const y2 = y + 50;
    drawLine(x1, y1, x2, y2);
    visualizeTree(node.left, x2, y2, level + 1);
  }

  // Draw line and visualize the right child if it exists and is not NIL
  if (node.right !== null && node.right !== tree.NIL) {
    const x1 = x;
    const y1 = y;
    const x2 = x + xOffset;
    const y2 = y + 50;
    drawLine(x1, y1, x2, y2);
    visualizeTree(node.right, x2, y2, level + 1);
  }
}


function drawLine(x1, y1, x2, y2) {
  // Create the line element
  const line = document.createElement('div');
  line.className = 'line';

  // Calculate the length of the line
  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  
  // Calculate the angle of the line
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

  // Apply styles
  line.style.width = `${length}px`;
  line.style.height = '2px'; // Line height
  line.style.backgroundColor = 'black'; // Line color

  // Calculate the start position for the line element
  const startX = x1;
  const startY = y1;

  // Position the line element
  line.style.position = 'absolute';
  line.style.left = `${startX}px`;
  line.style.top = `${startY}px`;

  // Transform to rotate the line and align it correctly
  line.style.transform = `rotate(${angle}deg)`;
  line.style.transformOrigin = '0 0'; // Rotation should start from the beginning of the line

  document.getElementById('tree').appendChild(line);
}




function insertNode() {
  const value = parseInt(document.getElementById('nodeValue').value);
  if (!isNaN(value)) {
    tree.insert(value);
    renderTree();
    document.getElementById('nodeValue').value = ''; // Clear the input after deletion
  }
}

function deleteNode() {
  const value = parseInt(document.getElementById('nodeValue').value);
  if (!isNaN(value)) {
    tree.delete(value);
    renderTree();
    document.getElementById('nodeValue').value = ''; // Clear the input after deletion
  }
}

function searchNode() {
  const value = parseInt(document.getElementById('nodeValue').value);
  if (!isNaN(value)) {
    let currentNode = tree.root;

    function highlightPath(node) {
      const nodeElement = [...document.querySelectorAll('.node')].find(el => el.textContent == node.value);
      if (nodeElement) nodeElement.style.backgroundColor = 'yellow';
      setTimeout(() => nodeElement.style.backgroundColor = node.color === 'red' ? 'red' : 'black', 500);
    }

    function traverseAndSearch(node, value) {
      if (node === tree.NIL) {
        alert('Node not found.');
        return;
      }
      highlightPath(node);

      setTimeout(() => {
        if (value < node.value) traverseAndSearch(node.left, value);
        else if (value > node.value) traverseAndSearch(node.right, value);
        else alert('Node found: ' + node.value);
      }, 500);
    }

    traverseAndSearch(currentNode, value);
  }
}

function traverseTree() {
  const traversalType = document.getElementById('traversalType').value;
  let result = [];

  // Delay function to wait for 500ms (0.5 seconds)
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Highlight the node and handle null checks
  async function highlightNode(node) {
    if (!node || node === tree.NIL || node.value === undefined) {
      console.warn("Node is null or undefined:", node); // Added warning
      return;
    }

    // Find the DOM element representing the node
    const nodeElement = [...document.querySelectorAll('.node')].find(el => el.textContent == node.value);

    if (nodeElement) {
      nodeElement.style.backgroundColor = 'yellow';
      await delay(500); // Wait for 0.5 seconds

      // Restore color based on type of node
      nodeElement.style.backgroundColor = node instanceof RedBlackNode ? 
        (node.color === 'red' ? 'red' : 'black') : 'lightblue';
    } else {
      console.warn("Node element not found in DOM for node value:", node.value); // Added warning
    }
  }

  // Breadth-first traversal
  async function bfs(root) {
    if (!root || root === tree.NIL) {
      console.warn("Tree root is null or empty in BFS");
      return;
    }
    const queue = [root];
    while (queue.length > 0) {
      const node = queue.shift();
      if (!node || node === tree.NIL) {
        console.warn("Encountered null or NIL node during BFS traversal, skipping.");
        continue;
      }
      await highlightNode(node); // Add delay before highlighting next node
      result.push(node.value);

      if (node.left !== tree.NIL) queue.push(node.left);
      if (node.right !== tree.NIL) queue.push(node.right);
    }
  }

  // Depth-first traversal
  async function dfs(root) {
    if (!root || root === tree.NIL) {
      console.warn("Tree root is null or empty in DFS");
      return;
    }
    await highlightNode(root); // Add delay before highlighting next node
    result.push(root.value);

    if (root.left !== tree.NIL) await dfs(root.left);
    if (root.right !== tree.NIL) await dfs(root.right);
  }

  // Pre-order traversal
  async function preOrder(node) {
    if (!node || node === tree.NIL) return;
    await highlightNode(node); // Add delay before highlighting next node
    result.push(node.value);

    await preOrder(node.left);
    await preOrder(node.right);
  }

  // In-order traversal
  async function inOrder(node) {
    if (!node || node === tree.NIL) return;
    await inOrder(node.left);
    await highlightNode(node); // Add delay before highlighting next node
    result.push(node.value);
    await inOrder(node.right);
  }

  // Post-order traversal
  async function postOrder(node) {
    if (!node || node === tree.NIL) return;
    await postOrder(node.left);
    await postOrder(node.right);
    await highlightNode(node); // Add delay before highlighting next node
    result.push(node.value);
  }

  // Run the selected traversal
  async function runTraversal() {
    if (tree.root === null || tree.root === tree.NIL) {
      console.warn("Tree is empty, cannot perform traversal");
      return;
    }

    if (traversalType === 'bfs') {
      await bfs(tree.root);
    } else if (traversalType === 'dfs') {
      await dfs(tree.root);
    } else if (traversalType === 'preOrder') {
      await preOrder(tree.root);
    } else if (traversalType === 'inOrder') {
      await inOrder(tree.root);
    } else if (traversalType === 'postOrder') {
      await postOrder(tree.root);
    }

    // Display the traversal result after it completes
    alert(`Traversal Result: ${result.join(', ')}`);
  }

  // Start the traversal
  runTraversal();
}








// Initialize tree when the page loads
document.addEventListener('DOMContentLoaded', initializeTree);

// Update tree type when changed
document.getElementById('treeType').addEventListener('change', initializeTree);
