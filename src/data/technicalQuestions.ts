import type { TechnicalQuestion } from '../types';

export const technicalQuestions: TechnicalQuestion[] = [
  // ======================== DSA (6 questions) ========================
  {
    id: 'dsa-001',
    topic: 'dsa',
    type: 'mcq',
    difficulty: 'easy',
    question: 'What is the time complexity of accessing an element in an array by index?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
    correctAnswer: 'O(1)',
    explanation: 'Accessing an array element by index is a direct memory address calculation, making it O(1) constant time.',
  },
  {
    id: 'dsa-002',
    topic: 'dsa',
    type: 'mcq',
    difficulty: 'easy',
    question: 'Which data structure uses LIFO (Last In, First Out) principle?',
    options: ['Queue', 'Stack', 'Linked List', 'Tree'],
    correctAnswer: 'Stack',
    explanation: 'A stack follows the LIFO principle where the last element inserted is the first one to be removed.',
  },
  {
    id: 'dsa-003',
    topic: 'dsa',
    type: 'mcq',
    difficulty: 'medium',
    question: 'In a binary search tree, what is the time complexity of searching for an element in the worst case?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctAnswer: 'O(n)',
    explanation: 'In the worst case (skewed tree), a BST degenerates into a linked list, making search O(n).',
  },
  {
    id: 'dsa-004',
    topic: 'dsa',
    type: 'coding',
    difficulty: 'medium',
    question: 'What is the output of this function for arr = [2, 4, 6, 8, 10] and target = 6?',
    codeSnippet: `function binarySearch(arr: number[], target: number): number {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    correctAnswer: '2',
    explanation: 'Binary search checks the middle element (index 2 = 6) and finds a match immediately, returning index 2.',
    hints: ['The array is sorted in ascending order.', 'Check what index the target value is at.'],
  },
  {
    id: 'dsa-005',
    topic: 'dsa',
    type: 'coding',
    difficulty: 'hard',
    question: 'What is the output of this function for nums = [10, 9, 2, 5, 3, 7, 101, 18]?',
    codeSnippet: `function lengthOfLIS(nums: number[]): number {
  const dp = new Array(nums.length).fill(1);
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  return Math.max(...dp);
}`,
    correctAnswer: '4',
    explanation: 'The longest increasing subsequence is [2, 3, 7, 101] or [2, 5, 7, 101], both of length 4.',
    hints: ['This is the classic LIS dynamic programming problem.', 'Track dp[i] = length of LIS ending at index i.'],
  },
  {
    id: 'dsa-006',
    topic: 'dsa',
    type: 'mcq',
    difficulty: 'hard',
    question: 'Which sorting algorithm has the best worst-case time complexity?',
    options: ['Bubble Sort', 'Quick Sort', 'Merge Sort', 'Selection Sort'],
    correctAnswer: 'Merge Sort',
    explanation: 'Merge Sort guarantees O(n log n) in all cases, while Quick Sort degrades to O(n^2) in the worst case.',
  },

  // ======================== DBMS (6 questions) ========================
  {
    id: 'dbms-001',
    topic: 'dbms',
    type: 'mcq',
    difficulty: 'easy',
    question: 'Which SQL clause is used to filter records based on a condition?',
    options: ['WHERE', 'HAVING', 'FILTER', 'CONDITION'],
    correctAnswer: 'WHERE',
    explanation: 'The WHERE clause filters rows before grouping, while HAVING filters after aggregation.',
  },
  {
    id: 'dbms-002',
    topic: 'dbms',
    type: 'mcq',
    difficulty: 'easy',
    question: 'What does ACID stand for in database transactions?',
    options: [
      'Atomicity, Consistency, Isolation, Durability',
      'Autonomy, Concurrency, Integrity, Dependency',
      'Atomicity, Concurrency, Isolation, Durability',
      'Accuracy, Consistency, Isolation, Durability',
    ],
    correctAnswer: 'Atomicity, Consistency, Isolation, Durability',
    explanation: 'ACID properties ensure reliable processing of database transactions.',
  },
  {
    id: 'dbms-003',
    topic: 'dbms',
    type: 'mcq',
    difficulty: 'medium',
    question: 'Which normal form ensures that every non-prime attribute is fully functionally dependent on the primary key?',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    correctAnswer: '2NF',
    explanation: '2NF eliminates partial dependencies by ensuring all non-key attributes depend on the entire primary key.',
  },
  {
    id: 'dbms-004',
    topic: 'dbms',
    type: 'coding',
    difficulty: 'medium',
    question: 'Given a table "Employees" with columns (id, name, department, salary), write a SQL query to find the second highest salary.',
    codeSnippet: `SELECT DISTINCT salary
FROM Employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;`,
    correctAnswer: 'Returns the second highest salary from the Employees table',
    explanation: 'ORDER BY salary DESC sorts salaries from highest to lowest; LIMIT 1 OFFSET 1 skips the highest and returns the next.',
    hints: ['Use ORDER BY with DESC', 'Combine LIMIT and OFFSET to skip the top salary.'],
  },
  {
    id: 'dbms-005',
    topic: 'dbms',
    type: 'mcq',
    difficulty: 'hard',
    question: 'Which type of index is implemented as a balanced tree structure in most relational databases?',
    options: ['Hash index', 'B+ Tree index', 'Bitmap index', 'Clustered index'],
    correctAnswer: 'B+ Tree index',
    explanation: 'B+ Trees are the most common index structure in databases like MySQL InnoDB, offering efficient range queries and O(log n) lookups.',
  },
  {
    id: 'dbms-006',
    topic: 'dbms',
    type: 'coding',
    difficulty: 'hard',
    question: 'What does this transaction isolation level prevent? Serializable isolation level in a transaction.',
    codeSnippet: `SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN TRANSACTION;
SELECT * FROM Accounts WHERE balance > 5000;
-- ... other operations
COMMIT;`,
    correctAnswer: 'Prevents dirty reads, non-repeatable reads, and phantom reads',
    explanation: 'Serializable is the highest isolation level. It ensures complete isolation by preventing dirty reads, non-repeatable reads, and phantom reads, but at the cost of concurrency.',
    hints: ['There are three common concurrency problems in transactions.', 'Serializable prevents all three.'],
  },

  // ======================== OS (6 questions) ========================
  {
    id: 'os-001',
    topic: 'os',
    type: 'mcq',
    difficulty: 'easy',
    question: 'Which CPU scheduling algorithm gives the shortest waiting time on average?',
    options: ['FCFS', 'SJF (Shortest Job First)', 'Round Robin', 'Priority Scheduling'],
    correctAnswer: 'SJF (Shortest Job First)',
    explanation: 'SJF is provably optimal for minimizing average waiting time, though it can cause starvation for longer jobs.',
  },
  {
    id: 'os-002',
    topic: 'os',
    type: 'mcq',
    difficulty: 'easy',
    question: 'What is a deadlock in an operating system?',
    options: [
      'A state where two or more processes are each waiting for resources held by the other',
      'A process that has terminated unexpectedly',
      'A condition where the CPU has stopped working',
      'A memory leak caused by a process',
    ],
    correctAnswer: 'A state where two or more processes are each waiting for resources held by the other',
    explanation: 'Deadlock occurs when each process in a set holds a resource and waits for a resource held by another process in the set.',
  },
  {
    id: 'os-003',
    topic: 'os',
    type: 'mcq',
    difficulty: 'medium',
    question: 'Which memory management technique may cause external fragmentation?',
    options: ['Paging', 'Segmentation', 'Virtual Memory', 'Demand Paging'],
    correctAnswer: 'Segmentation',
    explanation: 'Segmentation can cause external fragmentation because variable-sized segments are allocated in memory, leaving small unusable holes.',
  },
  {
    id: 'os-004',
    topic: 'os',
    type: 'coding',
    difficulty: 'medium',
    question: 'What is the output of this program simulating a producer-consumer problem?',
    codeSnippet: `const semaphore = { empty: 2, full: 0, mutex: 1 };
const buffer: number[] = [];

function producer() {
  semaphore.empty--;
  semaphore.mutex--;
  buffer.push(1);
  semaphore.mutex++;
  semaphore.full++;
}

function consumer() {
  semaphore.full--;
  semaphore.mutex--;
  const item = buffer.pop();
  semaphore.mutex++;
  semaphore.empty++;
}

producer();
producer();
consumer();
console.log(buffer.length);`,
    correctAnswer: '1',
    explanation: 'Two producer calls add 2 items, one consumer removes 1 item, leaving 1 item in the buffer.',
    hints: ['Count how many items are added and how many are removed.', 'The semaphore values track available slots.'],
  },
  {
    id: 'os-005',
    topic: 'os',
    type: 'mcq',
    difficulty: 'hard',
    question: 'Which page replacement algorithm suffers from Beladys anomaly?',
    options: ['Optimal Page Replacement', 'LRU (Least Recently Used)', 'FIFO (First In, First Out)', 'LFU (Least Frequently Used)'],
    correctAnswer: 'FIFO (First In, First Out)',
    explanation: 'FIFO can exhibit Beladys anomaly where increasing the number of frames increases the number of page faults.',
  },
  {
    id: 'os-006',
    topic: 'os',
    type: 'mcq',
    difficulty: 'hard',
    question: 'What is the difference between a process and a thread?',
    options: [
      'Threads share the same address space; processes have separate address spaces',
      'Processes are lighter than threads',
      'Threads cannot communicate with each other',
      'Processes always run in the kernel mode',
    ],
    correctAnswer: 'Threads share the same address space; processes have separate address spaces',
    explanation: 'Threads within the same process share memory and resources, while each process has its own isolated address space.',
  },

  // ======================== CN (6 questions) ========================
  {
    id: 'cn-001',
    topic: 'cn',
    type: 'mcq',
    difficulty: 'easy',
    question: 'Which layer of the OSI model is responsible for routing and forwarding packets?',
    options: ['Data Link Layer', 'Network Layer', 'Transport Layer', 'Session Layer'],
    correctAnswer: 'Network Layer',
    explanation: 'The Network Layer (Layer 3) handles routing, logical addressing, and packet forwarding.',
  },
  {
    id: 'cn-002',
    topic: 'cn',
    type: 'mcq',
    difficulty: 'easy',
    question: 'Which protocol is used to translate domain names to IP addresses?',
    options: ['HTTP', 'DNS', 'DHCP', 'FTP'],
    correctAnswer: 'DNS',
    explanation: 'The Domain Name System (DNS) resolves human-readable domain names (e.g., google.com) into IP addresses.',
  },
  {
    id: 'cn-003',
    topic: 'cn',
    type: 'mcq',
    difficulty: 'medium',
    question: 'Which TCP/IP protocol is connectionless and does not guarantee delivery?',
    options: ['TCP', 'UDP', 'HTTP', 'FTP'],
    correctAnswer: 'UDP',
    explanation: 'UDP (User Datagram Protocol) is connectionless and provides no reliability guarantees, making it faster but less reliable than TCP.',
  },
  {
    id: 'cn-004',
    topic: 'cn',
    type: 'coding',
    difficulty: 'medium',
    question: 'What HTTP status code is returned when a resource has been permanently moved?',
    codeSnippet: `HTTP/1.1 301 Moved Permanently
Location: https://new-site.com/page
Content-Type: text/html`,
    correctAnswer: '301',
    explanation: 'HTTP 301 indicates a permanent redirect. The client should update its bookmarks and use the new URL going forward.',
    hints: ['This status code starts with 3.', 'It indicates a permanent redirect.'],
  },
  {
    id: 'cn-005',
    topic: 'cn',
    type: 'mcq',
    difficulty: 'hard',
    question: 'Which routing protocol uses the Bellman-Ford algorithm?',
    options: ['OSPF', 'RIP', 'BGP', 'IS-IS'],
    correctAnswer: 'RIP',
    explanation: 'RIP (Routing Information Protocol) uses the Bellman-Ford distance-vector algorithm to determine the best path.',
  },
  {
    id: 'cn-006',
    topic: 'cn',
    type: 'mcq',
    difficulty: 'hard',
    question: 'What type of attack is a SYN flood?',
    options: [
      'A Denial of Service attack that exploits the TCP three-way handshake',
      'An attack that injects malicious SQL queries',
      'A man-in-the-middle attack on DNS responses',
      'A brute force attack on SSH credentials',
    ],
    correctAnswer: 'A Denial of Service attack that exploits the TCP three-way handshake',
    explanation: 'SYN flood sends many SYN packets without completing the handshake, exhausting server resources and causing denial of service.',
  },

  // ======================== OOP (6 questions) ========================
  {
    id: 'oop-001',
    topic: 'oop',
    type: 'mcq',
    difficulty: 'easy',
    question: 'Which OOP principle allows a class to inherit properties and methods from another class?',
    options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Abstraction'],
    correctAnswer: 'Inheritance',
    explanation: 'Inheritance enables a child class to reuse and extend the behavior of a parent class.',
  },
  {
    id: 'oop-002',
    topic: 'oop',
    type: 'mcq',
    difficulty: 'easy',
    question: 'What is the process of hiding internal implementation details and exposing only necessary functionality called?',
    options: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction'],
    correctAnswer: 'Abstraction',
    explanation: 'Abstraction hides complex implementation details and exposes only relevant features to the user.',
  },
  {
    id: 'oop-003',
    topic: 'oop',
    type: 'mcq',
    difficulty: 'medium',
    question: 'Which type of polymorphism is achieved through method overriding?',
    options: ['Compile-time polymorphism', 'Runtime polymorphism', 'Static polymorphism', 'Parametric polymorphism'],
    correctAnswer: 'Runtime polymorphism',
    explanation: 'Method overriding allows a subclass to provide a specific implementation of a method defined in its parent class, resolved at runtime via dynamic dispatch.',
  },
  {
    id: 'oop-004',
    topic: 'oop',
    type: 'coding',
    difficulty: 'medium',
    question: 'What is the output of this code demonstrating polymorphism?',
    codeSnippet: `abstract class Animal {
  abstract speak(): string;
}

class Dog extends Animal {
  speak(): string { return "Woof"; }
}

class Cat extends Animal {
  speak(): string { return "Meow"; }
}

const animals: Animal[] = [new Dog(), new Cat()];
console.log(animals.map(a => a.speak()).join(", "));`,
    correctAnswer: 'Woof, Meow',
    explanation: 'Each subclass overrides the speak() method. When called polymorphically, the correct implementation is invoked based on the actual runtime type.',
    hints: ['Each animal subclass returns its own sound.', 'The join(", ") combines them with a comma separator.'],
  },
  {
    id: 'oop-005',
    topic: 'oop',
    type: 'coding',
    difficulty: 'hard',
    question: 'What is the output of this code about encapsulation and access modifiers?',
    codeSnippet: `class BankAccount {
  private balance: number = 0;

  deposit(amount: number): void {
    if (amount > 0) this.balance += amount;
  }

  withdraw(amount: number): boolean {
    if (amount > 0 && amount <= this.balance) {
      this.balance -= amount;
      return true;
    }
    return false;
  }

  getBalance(): number { return this.balance; }
}

const acc = new BankAccount();
acc.deposit(100);
acc.withdraw(30);
acc.withdraw(80);
console.log(acc.getBalance());`,
    correctAnswer: '70',
    explanation: 'Deposit 100, withdraw 30 (balance=70), withdraw 80 fails (insufficient funds, balance stays 70). Final balance is 70.',
    hints: ['Track the balance step by step.', 'The second withdrawal of 80 exceeds the current balance of 70.'],
  },
  {
    id: 'oop-006',
    topic: 'oop',
    type: 'mcq',
    difficulty: 'hard',
    question: 'Which design pattern ensures a class has only one instance and provides a global point of access to it?',
    options: ['Factory Pattern', 'Singleton Pattern', 'Observer Pattern', 'Strategy Pattern'],
    correctAnswer: 'Singleton Pattern',
    explanation: 'The Singleton pattern restricts instantiation of a class to a single instance and provides a global access point to that instance.',
  },
];
