import { SNode } from "./models";

function getParentIndex(childIndex: number) {
  return Math.floor((childIndex - 1) / 2);
}

function getLeftChild(parentIndex: number) {
  return parentIndex * 2 + 1;
}

function getRightChild(parentIndex: number) {
  return parentIndex * 2 + 2;
}

export class MinHeap {
  private array: SNode[] = [];
  private fScore: { [key in string]: number };

  constructor(data: SNode[], fScore: { [key in string]: number }) {
    this.array = [];
    this.fScore = fScore;

    if (data && Array.isArray(data)) {
      this.array = data;
      const { length } = this.array;
      for (let i = Math.floor((length - 1) / 2); i >= 0; i--) {
        this.bubbleDown(i, this.array[i]);
      }
    }
  }

  exists(data: SNode) {
    return this.array.find((n) => n.key === data.key);
  }

  add(data: SNode) {
    this.array.push(data);
    this.bubbleUp(this.array.length - 1, data);
  }

  removeHead() {
    const headNode = this.array[0];
    const tailNode = this.array.pop() as SNode;
    if (this.array.length) {
      this.array[0] = tailNode;
      this.bubbleDown(0, tailNode);
    }
    return headNode;
  }

  bubbleDown(parentIndex: number, parentData: SNode) {
    if (parentIndex < this.array.length) {
      let targetIndex = parentIndex;
      let targetData = parentData;
      const leftChildIndex = getLeftChild(parentIndex);
      const rightChildIndex = getRightChild(parentIndex);
      const trySwap = (index: number, array: SNode[], shouldSwap: (childData: SNode, parentData: SNode) => boolean) => {
        if (index < array.length) {
          const data = array[index];
          if (shouldSwap(data, targetData)) {
            targetIndex = index;
            targetData = data;
          }
        }
      };

      const shouldSwap = (childData: SNode, parentData: SNode) =>
        this.fScore[childData.key] < this.fScore[parentData.key];

      trySwap(leftChildIndex, this.array, shouldSwap);
      trySwap(rightChildIndex, this.array, shouldSwap);
      if (targetIndex !== parentIndex) {
        this.array[parentIndex] = targetData;
        this.array[targetIndex] = parentData;
        this.bubbleDown(targetIndex, parentData);
      }
    }
  }

  bubbleUp(childIndex: number, childData: SNode) {
    if (childIndex > 0) {
      const parentIndex = getParentIndex(childIndex);
      const parentData = this.array[parentIndex];

      const shouldSwap = (childData: SNode, parentData: SNode) =>
        this.fScore[childData.key] < this.fScore[parentData.key];

      if (shouldSwap(childData, parentData)) {
        this.array[parentIndex] = childData;
        this.array[childIndex] = parentData;
        this.bubbleUp(parentIndex, childData);
      }
    }
  }
}
