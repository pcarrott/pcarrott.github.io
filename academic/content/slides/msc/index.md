---
title: 'Slides: Formal Specification and Verification of the Lazy JellyFish Skip List'
authors: []
tags: []
categories: []
date: '2022-02-05'
slides:
  theme: light
  highlight_style: dracula
---

### **Formal Specification and Verification of the Lazy JellyFish Skip List**
#### MSc Thesis Defense

<br>

Pedro Carrott --- *IST, University of Lisbon*

**Advisor:** João Ferreira --- *IST, University of Lisbon*

<span class="footer"> Press the `S` key to view the speaker notes </span>

{{< speaker_note >}} <sub>

Hello. Today I'm presenting my Master's thesis, advised by Professor João Ferreira, on the formal verification of the Lazy JellyFish Skip List, an implementation for concurrent maps with version control.

</sub> {{< /speaker_note >}}

---

<section>

## Introduction

<sup> (continue below) </sup>

---

### Concurrent Maps

Concurrent maps are used by data store applications to index data efficiently

Most data stores record the value history of each key, rather than delete old values

{{< speaker_note >}} <sub>

Maps provide an abstraction for a collection of key-value pairs. This is a useful abstraction for applications such as data stores, which require efficient structures to index data.

In fact, most of these applications maintain a history of values for each key in the map, so as to record different versions of the same data, instead of deleting outdated information.

</sub> {{< /speaker_note >}}

---

### The JellyFish Skip List

The skip list is the most widely used map implementation by these applications

JellyFish extends traditional skip lists by associating a list of timestamped values to each key

{{< speaker_note >}} <sub>

The most widely used implementation for such concurrent append-only maps is the skip list data structure.

A state-of-the-art implementation for concurrent append-only skip lists is JellyFish, which extends traditional skip lists by storing a linked list in each node to reflect the history of values associated to its key.

</sub> {{< /speaker_note >}}

---

### Iris

We verify a variant of JellyFish using the concurrent separation logic of [Iris](https://iris-project.org/).

The Coq formalization is [publicly available](https://github.com/sr-lab/iris-jellyfish)

{{< speaker_note >}} <sub>

In this work, we verify the functional correctness of a lock-based variant of JellyFish using Iris, a state-of-the-art concurrent separation logic.

All results are mechanized in Coq and available in GitHub.

</sub> {{< /speaker_note >}}

---

### Map Specification

We provide a new specification for concurrent maps with version control

Conflicting writes are handled by a novel resource algebra for the $\textsf{argmax}$ operation

{{< speaker_note >}} <sub>

Our verification efforts provide a new concurrent map specification, which supports version control through the use of timestamps.

To reason about conflicting writes, we have formalized in Iris a novel resource algebra for the argmax operation.

</sub> {{< /speaker_note >}}

</section>

---

<section>

## Skip Lists

<sup> (continue below) </sup>

{{< speaker_note >}} <sub>

We begin by looking at the implementation of the lazy JellyFish skip list.

</sub> {{< /speaker_note >}}

---

### Overview

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  A skip list contains two sentinel nodes with keys MIN and MAX, linked in HMAX lists
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  Each list is a sublist of its lower level and all lists are sorted by key
  {{< /fragment >}}

  {{< fragment weight=3 >}}
  Elements can be skipped by searching the lists in the higher levels
  {{< /fragment >}}
</div>

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  <img src="images/empty.svg">
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  <img src="images/skip.svg">
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  <img src="images/skip1.svg">
  {{< /fragment >}}

  {{< fragment class=current-visible >}}
  <img src="images/skip2.svg">
  {{< /fragment >}}

  {{< fragment class=current-visible >}}
  <img src="images/skip3.svg">
  {{< /fragment >}}

  {{< fragment >}}
  <img src="images/skip4.svg">
  {{< /fragment >}}
</div>

{{< speaker_note >}} <sub>

The skip list is initialized with two sentinel nodes with keys MIN and MAX, defining the valid key range for the structure. The left sentinel contains an array of HMAX entries, each pointing to the right sentinel, initializing HMAX empty linked lists.

As new keys are inserted to the skip list, each list must always remain a sublist of the list directly below it, while the bottom list should contain all keys which have been inserted.

Since each level contains progressively fewer elements of the bottom list, maintaining all lists sorted allows searches in higher levels to skip elements that would otherwise be traversed in a standard linear search. We search in the top level ...

... stop searching when we reach a value equal to or greater than the key ...

... descend to the next level starting from the same element and repeat until we reach the bottom level.

If the key is not found upon reaching the bottom level, then we can conclude that it does not belong to the skip list.

</sub> {{< /speaker_note >}}

---

### JellyFish

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  The JellyFish skip list implements a map, storing key-value pairs
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  Each node contains a <i>vertical list</i>, a timeline with timestamped values
  {{< /fragment >}}

  {{< fragment weight=3 >}}
  To append a new value, the timestamp must be <i>at least as recent</i> as the head's
  {{< /fragment >}}
</div>

{{< fragment weight=1 >}}
<img src="images/jelly5.svg">
{{< /fragment >}}

{{< speaker_note >}} <sub>

Skip lists can also be used to implement key-value stores.

The JellyFish design keeps in each node a list of timestamped values, referred to as a vertical list, representing the timeline of values associated to the key.

The timeline retains its consistency by never appending new values to a vertical list if the new timestamp is less recent than the timestamp found at the head.

</sub> {{< /speaker_note >}}

---

### Concurrent Updates

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  Updating threads employ lazy synchronization through locks
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  Traversal is done until the bottom, locking the key's predecessor
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  If the key does not exist, then a new node is linked to a random number of levels
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  The lock is released after insertion, locking the predecessor in the next level
  {{< /fragment >}}

  {{< fragment weight=5 class=current-visible >}}
  Insertions are done bottom-up to maintain the sublist relation
  {{< /fragment >}}

  {{< fragment weight=6 class=current-visible >}}
  Updates follow the same initial steps, locking the key's predecessor in the bottom level
  {{< /fragment >}}

  {{< fragment weight=7 >}}
  If a node already exists for the key, then the new value will be appended to the vertical list
  {{< /fragment >}}
</div>

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  <img src="images/jelly1.svg">
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  <img src="images/jelly2.svg">
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  <img src="images/jelly3.svg">
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  <img src="images/jelly4.svg">
  {{< /fragment >}}

  {{< fragment weight=5 class=current-visible >}}
  <img src="images/jelly5.svg">
  {{< /fragment >}}

  {{< fragment weight=6 class=current-visible >}}
  <img src="images/jelly6.svg">
  {{< /fragment >}}

  {{< fragment weight=7 >}}
  <img src="images/jelly7.svg">
  {{< /fragment >}}
</div>

{{< speaker_note >}} <sub>

To ensure that concurrent updates to the data structure alter the state safely, the put operation employs a lazy synchronization strategy using locks. A thread trying to insert key 24 will first traverse the skip list until the bottom level to find its predecessor in key 17 and then ... 

... acquires the node's lock in the bottom level. Since the key has not been found, ...

... a new node is created with some random height. As the predecessor's lock has been acquired, ...

... we can replace its successor by linking the new node to the bottom level. The lock can then be released and the node can be inserted in the upper level.

Insertions are performed bottom-up so as to ensure that the sublist relation is preserved.

A following update on key 24 will repeat the same initial steps by traversing the skip list until the bottom level and locking its predecessor. As the node already exists it will append a new value to its vertical list, ...

... as long as the timestamp is as recent as 3. In short, claiming a node's lock grants exclusive access to update the node's successor at the lock's level, while the bottom level locks also control updates to the value of the node's successor.

</sub> {{< /speaker_note >}}

</section>

---

<section>

## Reasoning about Timestamped Domains

<sup> (continue below) </sup>

{{< speaker_note >}} <sub>

Having seen how the data is organized in memory, we now abstract from the concrete implementation and discuss how we can reason about concurrent maps in Iris through ghost state.

</sub> {{< /speaker_note >}}

---

### Ghost state in Iris

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  Ghost state matches the physical state of shared data with an abstract state
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  For concurrent updates to be proven consistent, ghost state is defined as a resource algebra
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  Two elements define a resource algebra (RA):
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  The operator is commutative and associative, making the order of operations irrelevant
  {{< /fragment >}}

  {{< fragment weight=7 class=fade-out >}}
  {{< fragment weight=5 >}}
  Consider the following ghost variable $a$, which is composed by $f$ and $a^\prime$
  {{< /fragment >}}
  {{< /fragment >}}

  {{< fragment weight=7 class=current-visible >}}
  We can split the ghost variable into two separate ghost resources ...
  {{< /fragment >}}

  {{< fragment weight=8 class=current-visible >}}
  ... and perform an update on one of them using the RA operator
  {{< /fragment >}}

  {{< fragment weight=9 class=current-visible >}}
  The resources can be joined to obtain the composition of all elements
  {{< /fragment >}}

  {{< fragment weight=10 class=current-visible >}}
  The elements can be composed in any order, due to commutativity and associativity
  {{< /fragment >}}

  {{< fragment weight=11 class=current-visible >}}
  The local update is equivalent to updating the original decomposed variable
  {{< /fragment >}}
</div>

<div class="r-stack">
  {{< fragment weight=3 class=fade-out >}}
  {{< fragment weight=1 >}}
  <span class="ghost"> 
  $a$
  </span><sup class="name">$ \ \gamma $</sup>
  {{< /fragment >}}
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  - **Domain**: type of the ghost variable
  - **Operator**: splits, joins and updates variables
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  <span class="smath"> 
  $ a \cdot b = b \cdot a \qquad \qquad (a \cdot b) \cdot c = a \cdot (b \cdot c)$
  </span>
  {{< /fragment >}}

  {{< fragment weight=5 class=current-visible >}}
  <span class="ghost"> 
  $a$
  </span><sup class="name">$ \ \gamma $</sup>
  {{< /fragment >}}

  {{< fragment weight=6 class=current-visible >}}
  <span class="ghost"> 
  $f \cdot a^\prime$
  </span><sup class="name">$ \ \gamma $</sup>
  {{< /fragment >}}

  {{< fragment weight=7 class=current-visible >}}
  <span class="ghost"> 
  $f$
  </span><sup class="name">$ \ \gamma $</sup>
  <span class="smath">$*$</span>
  <span class="ghost"> 
  $a^\prime$
  </span><sup class="name">$ \ \gamma $</sup>
  {{< /fragment >}}

  {{< fragment weight=8 class=current-visible >}}
  <span class="ghost"> 
  $f$
  </span><sup class="name">$ \ \gamma $</sup>
  <span class="smath">$*$</span>
  <span class="ghost"> 
  $a^\prime \cdot x$
  </span><sup class="name">$ \ \gamma $</sup>
  {{< /fragment >}}

  {{< fragment weight=9 class=current-visible >}}
  <span class="ghost"> 
  $f \cdot a^\prime \cdot x$
  </span><sup class="name">$ \ \gamma $</sup>
  {{< /fragment >}}

  {{< fragment weight=10 >}}
  <span class="ghost"> 
  $a \cdot x$
  </span><sup class="name">$ \ \gamma $</sup>
  {{< /fragment >}}
</div>

{{< speaker_note >}} <sub>

In Iris, ghost state provides a way of matching the physical state of shared data with an abstract state where certain properties must hold.

These properties are upheld by modelling ghost state as a resource algebra.

A resource algebra can be defined by indicating a domain and a binary operator for that domain.

We enforce the operator to be both commutative and associative, which allows us to avoid considering all possible orders of execution for multiple concurrent operations.

If we manage to decompose a ghost variable "a" using the resource algebra operator ...

... then we can split it into two separate variables. 

A thread can then ...

... perform an update "x" on one of them without altering the other one ...

... and rejoin both resources to obtain the full view of the updated variable. Since the operator is commutative and associative, we can compose the operands by whichever order we choose. 

As such, we can assert that the resulting state of the variable is equivalent to the initial state updated by "x".

In other words, the update performed by a thread on a partial view is equivalent to an update to the full view.

</sub> {{< /speaker_note >}}

---

### Map Composition

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  We need to consider map composition to abstract the physical state of JellyFish
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  For different keys, the combined map will contain both key-value pairs
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  But what happens when both threads associate different values to the same key?
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  The key will be associated to the composition of both values using another RA
  {{< /fragment >}}
</div>

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  <span class="smath">
  $ M_1 \cdot M_2 = M_1 \cup M_2 $
  </span>
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  <span class="smath">
  $ \{ \ k_1 : x \ \} \cup \{ \ k_2 : y \ \} $
  </span>
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  <span class="smath">
  $ \{ \ k : x \ \} \cup \{ \ k : y \ \} $
  </span>
  {{< /fragment >}}

  {{< fragment weight=4 >}}
  <span class="smath">
  $ \{ \ k : x \cdot y \ \} $
  </span>
  {{< /fragment >}}
</div>

{{< speaker_note >}} <sub>

To verify JellyFish, we need to consider a suitable resource algebra to abstract concurrent maps.

If the threads hold no key in common, then the combined map is simply a map containing all key-value pairs of both threads.

However, when there exists some key in common, the associated value may differ in both views. 

This issue can be resolved by returning a new map entry where the associated value is the composition of both values. Therefore, we need to define a resource algebra for values of the map.

</sub> {{< /speaker_note >}}

---

### Value Composition

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  Keys are associated to their most recent value, which will have the greatest timestamp
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  If $i < j$, then the pair with value $a$ is discarded, returning the pair with value $b$
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  For equal timestamps, both values are possible, depending on the scheduler
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  As a result, the abstract map associates each key to a *set* of possible values
  {{< /fragment >}}

  {{< fragment weight=5 >}}
  A unit element is also necessary to apply the update rules on maps
  {{< /fragment >}}
</div>

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  The $\textsf{argmax}$ operator returns that value
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  <span class="smath">
  $ (a, i) \cdot (b, j) = (b, j) $
  </span>
  {{< /fragment >}}

  {{< fragment weight=5 class=fade-out >}}
  {{< fragment weight=3 >}}
  <span class="smath">
  $ (a, i) \cdot (b, i) = (a \cup b, i) $
  </span>
  {{< /fragment >}}
  {{< /fragment >}}

  {{< fragment weight=5 >}}
  <span class="smath">
  $ (a, i) \cdot \textsf{botZ} = (a, i) $
  </span>
  {{< /fragment >}}
</div>

{{< speaker_note >}} <sub>

As we've seen previously, JellyFish always maintains its most recent value at the head of its vertical list. The abstract map should thus associate each key to the value with the greatest timestamp, meaning that the resource algebra operator for value composition should be the argmax operator.

Values should be represented as pairs, where timestamp "j" being greater than timestamp "i" returns the pair with value "b", discarding the value "a".

However, when both timestamps are equal, the value left at the head of the vertical list will depend on the scheduler. As such, both "a" and "b" may be the value associated to the key, so ...

... we require "a" and "b" to be sets rather than the actual values. In that way, we can maintain each key associated to all possible values, along with the corresponding timestamp "i".

Finally, we define a unit element, as it is necessary to complete the proofs, due to the update rules on maps. To the best of our knowledge, this is the first effort to formalize the argmax resource algebra.

</sub> {{< /speaker_note >}}

</section>

---

<section>

## Map Specification

<sup> (continue below) </sup>

{{< speaker_note >}} <sub>

Based on these resource algebras, we now define a specification for JellyFish.

</sub> {{< /speaker_note >}}

---

### Map Resources

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  We define the following representation predicate:
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  $p$ is the left sentinel pointer
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  $M$ reflects partial knowledge of the map
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  $q$ is a fraction between $0$ and $1$
  {{< /fragment >}}

  {{< fragment weight=5 class=current-visible >}}
  $\gamma$ refers to the required ghost state
  {{< /fragment >}}

  {{< fragment weight=8 class=fade-out >}}
  {{< fragment weight=6 >}}
  These resources can be split into smaller fractions ...
  {{< /fragment >}}
  {{< /fragment >}}

  {{< fragment weight=8 >}}
  ... and combined to obtain the larger fractions
  {{< /fragment >}}
</div>

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  <span class="smath">
  $ \textsf{IsSkipList}(p, M, q, \gamma) $
  </span>
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  <span class="smath">
  $ \textsf{IsSkipList}(\textcolor{red}{p}, M, q, \gamma) $
  </span>
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  <span class="smath">
  $ \textsf{IsSkipList}(p, \textcolor{red}{M}, q, \gamma) $
  </span>
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  <span class="smath">
  $ \textsf{IsSkipList}(p, M, \textcolor{red}{q}, \gamma) $
  </span>
  {{< /fragment >}}

  {{< fragment weight=5 class=current-visible >}}
  <span class="smath">
  $ \textsf{IsSkipList}(p, M, q, \textcolor{red}{\gamma}) $
  </span>
  {{< /fragment >}}

  {{< fragment weight=6 >}}
  <span class="smath">
  $ \textsf{IsSkipList}(p, M_1 \cup M_2, q_1 + q_2, \gamma) $
  </span>
  {{< /fragment >}}
</div>

<div class="r-stack">
  {{< fragment weight=7 class=current-visible >}}
  <span class="smath">
  $ \downarrow $
  </span>
  {{< /fragment >}}

  {{< fragment weight=8 >}}
  <span class="smath">
  $ \uparrow $
  </span>
  {{< /fragment >}}
</div>

{{< fragment weight=7 >}}
<span class="smath">
$ \textsf{IsSkipList}(p, M_1, q_1, \gamma) * \textsf{IsSkipList}(p, M_2, q_2, \gamma) $
</span>
{{< /fragment >}}

{{< speaker_note >}} <sub>

First, we require a representation predicate to describe the known state of the map, called IsSkipList.

IsSkipList is parameterized by the pointer to the left sentinel, which tracks the physical state, ...

... an abstract map, which corresponds to partial knowledge of the full map, ...

... a fraction, which indicates that we hold exclusive ownership of the full map if equal to 1, ...

... and a list of ghost names to keep track of the required ghost state.

This resource can be shared by decomposing the map and splitting the fraction ...

... yielding two new resources.

Separate resources can also be joined to obtain a larger fraction of the skip list.

</sub> {{< /speaker_note >}}

---

### Triple for constructor

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  The Hoare triple for $\textsf{new}$ is straightforward
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  No resources are needed as a precondition ...
  {{< /fragment >}}

  {{< fragment weight=3 >}}
  ... and we obtain the full fraction of an empty map
  {{< /fragment >}}
</div>

<div class="smath">
  {{< fragment weight=2 >}}
  $ \left\\{ \ \textsf{True} \ \right\\} \\\\ $
  {{< /fragment >}}
</div>

<div class="smath">
  {{< fragment weight=1 >}}
  $ \textsf{new} \\\\ $
  {{< /fragment >}}
</div>

<div class="smath">
  {{< fragment weight=3 >}}
  $ \left\\{ \ p. \ \exists \ \gamma. \ \textsf{IsSkipList}(p, \varnothing, 1, \gamma) \ \right\\} $
  {{< /fragment >}}
</div>

{{< speaker_note >}} <sub>

To define the JellyFish specification, we first consider the Hoare triple for the skip list constructor.

This method does not need any initial resources as a precondition ...

... and the postcondition simply asserts exclusive ownership of an empty map, where the return value p corresponds to the left sentinel pointer.

</sub> {{< /speaker_note >}}

---

### Triple for updates

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  $\textsf{put}$ receives a key, value and timestamp
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  Holding partial knowledge of the map, ...
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  ... $\textsf{put}$ updates the map with the new value
  {{< /fragment >}}

  {{< fragment weight=4 >}}
  Concurrent updates are handled by the RAs
  {{< /fragment >}}
</div>

<div class="smath">
  {{< fragment weight=2 >}}
  $ \left\\{ \ \textsf{IsSkipList}(p, M, q, \gamma) \ \right\\} \\\\ $
  {{< /fragment >}}
</div>

<div class="smath">
  {{< fragment weight=1 >}}
  $ \textsf{put} \ p \ k \ v \ t \\\\ $
  {{< /fragment >}}
</div>

<div class="smath">
  {{< fragment weight=3 >}}
  $ \left\\{ \ \textsf{IsSkipList}(p, M \cup \\{ \ k : (\\{ v \\}, t) \ \\}, q, \gamma) \ \right\\} $
  {{< /fragment >}}
</div>

{{< speaker_note >}} <sub>

The put method is parameterized by the updated key, as well as its new value and timestamp.

Its Hoare triple requires an IsSkipList resource to reflect the current knowledge that the thread has of the map.

In the postcondition, this knowledge is updated with a new map entry for the key, associated to a pair containing the new value and timestamp. 

As we've seen in the previous section, the map and argmax resource algebras will handle how the updates of each thread are composed.

</sub> {{< /speaker_note >}}

---

### Triple for lookups

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  $\textsf{get}$ performs a search for a key
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  We consider exclusive ownership of the map
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  The map remains unchanged after the search
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  The result is empty if the key is not in the map
  {{< /fragment >}}

  {{< fragment weight=5 >}}
  Otherwise, it must be one of the values in the map
  {{< /fragment >}}
</div>

<div class="smath">
  {{< fragment weight=2 >}}
  $ \left\\{ \ \textsf{IsSkipList}(p, M, 1, \gamma) \ \right\\} \\\\ $
  {{< /fragment >}}
</div>

<div class="smath">
  {{< fragment weight=1 >}}
  $ \textsf{get} \ p \ k \\\\ $
  {{< /fragment >}}
</div>

<div class="r-stack smath">
  {{< fragment weight=3 class=current-visible >}}
  $ \left\\{ \ v^?. \begin{array}{c} \textcolor{red}{\textsf{IsSkipList}(p, M, 1, \gamma)} * ((v^? = \textsf{None} * M[k] = \textsf{None}) \ \lor \\\\ (\exists \ v, S, t. \ v^? = \textsf{Some}(v, t) * M[k] = \textsf{Some}(S, t) * v \in S)) \end{array} \right\\} $
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  $ \left\\{ \ v^?. \begin{array}{c} \textsf{IsSkipList}(p, M, 1, \gamma) * (\textcolor{red}{(v^? = \textsf{None} * M[k] = \textsf{None})} \ \lor \\\\ (\exists \ v, S, t. \ v^? = \textsf{Some}(v, t) * M[k] = \textsf{Some}(S, t) * v \in S)) \end{array} \right\\} $
  {{< /fragment >}}

  {{< fragment weight=5 >}}
  $ \left\\{ \ v^?. \begin{array}{c} \textsf{IsSkipList}(p, M, 1, \gamma) * ((v^? = \textsf{None} * M[k] = \textsf{None}) \ \lor \\\\ \textcolor{red}{(\exists \ v, S, t. \ v^? = \textsf{Some}(v, t) * M[k] = \textsf{Some}(S, t) * v \in S)}) \end{array} \right\\} $
  {{< /fragment >}}
</div>

{{< speaker_note >}} <sub>

Finally, the get method performs a lookup for the current value of some key.

Since an updating thread might immediately invalidate the result of a search, we only consider the case where we hold exclusive ownership of the skip list ...

... which we maintain in the postcondition, as the search operation should not alter the state of the data.

If the key does not exists in the map, then the search must come up empty.

Otherwise, the return result and the entry in the abstract map should agree on the timestamp. We can only assert that the value returned by the search must be one of the possible values associated to the key, since we cannot disambiguate between updates done with the same timestamp.

</sub> {{< /speaker_note >}}

</section>

---

<section>

## Representation Predicate

<sup> (continue below) </sup>

{{< speaker_note >}} <sub>

We will now see the underlying definition for the IsSkipList predicate.

</sub> {{< /speaker_note >}}

---

### Left Sentinel

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  The parameter $p$ points to the left sentinel node
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  The pointer must be persistent
  {{< /fragment >}}

  {{< fragment weight=3 >}}
  The left sentinel must have key $\textsf{MIN}$
  {{< /fragment >}}
</div>

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  <span class="smath">
  $ \exists \ head. \ p \hookrightarrow_\square head * head\textsf{.key} = \textsf{MIN} $
  </span>
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  <span class="smath">
  $ \exists \ head. \ \textcolor{red}{p \hookrightarrow_\square head} * head\textsf{.key} = \textsf{MIN} $
  </span>
  {{< /fragment >}}

  {{< fragment weight=3 >}}
  <span class="smath">
  $  \exists \ head. \ p \hookrightarrow_\square head * \textcolor{red}{head\textsf{.key} = \textsf{MIN}} $
  </span>
  {{< /fragment >}}
</div>

{{< speaker_note >}} <sub>

The left sentinel should be a node stored in the memory location aliased by the paramenter "p".

The corresponding points-to assertion is made persistent, since "p" should always point to the same node.

We guarantee that the node is, in fact, the left sentinel by asserting that its key is equal to the minimum value.

</sub> {{< /speaker_note >}}

---

### Iris Invariants

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  Shared resources are expressed in Iris through invariants
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  Invariant assertions are kept within a solid border ...
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  ... and associated to a given namespace
  {{< /fragment >}}
</div>

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  <span class="inv">
  $ I $
  </span><sup class="name">$ \ \mathcal{N} $</sup>
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  <span class="inv" style="border-color: red">
  $ I $
  </span><sup class="name">$ \ \mathcal{N} $</sup>
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  <span class="inv">
  $ I $
  </span><sup class="name">$ \ \textcolor{red}{\mathcal{N}} $</sup>
  {{< /fragment >}}
</div>

{{< speaker_note >}} <sub>

The remaining nodes of the skip list, however, may change depending on the operations performed by different threads. To reason about shared mutable resources ...

... Iris allows the definition of invariants ...

... which are associated to namespaces.

</sub> {{< /speaker_note >}}

---

### Bottom List

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  Each level will contain its own invariant describing the level's linked list
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  Each invariant will have a unique namespace provided by $\textsf{levelN}$
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  A unique invariant is defined for the bottom list, describing the full map
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  The invariant requires the left sentinel node ...
  {{< /fragment >}}

  {{< fragment weight=5 >}}
  ... and the ghost names for the bottom level
  {{< /fragment >}}
</div>

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  <span class="inv">
  $\textsf{BotListInv}(head, \gamma^0) $
  </span><sup class="name">$ \ \textsf{levelN}(0) $</sup>
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  <span class="inv">
  $\textsf{BotListInv}(head, \gamma^0) $
  </span><sup class="name">$ \ \textcolor{red}{\textsf{levelN}(0)} $</sup>
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  <span class="inv">
  $\textcolor{red}{\textsf{BotListInv}}(head, \gamma^0) $
  </span><sup class="name">$ \ \textsf{levelN}(0) $</sup>
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  <span class="inv">
  $\textsf{BotListInv}(\textcolor{red}{head}, \gamma^0) $
  </span><sup class="name">$ \ \textsf{levelN}(0) $</sup>
  {{< /fragment >}}

  {{< fragment weight=5 >}}
  <span class="inv">
  $\textsf{BotListInv}(head, \textcolor{red}{\gamma^0}) $
  </span><sup class="name">$ \ \textsf{levelN}(0) $</sup>
  {{< /fragment >}}
</div>

{{< speaker_note >}} <sub>

Since each level can be seen as its own linked list, we define a unique invariant per level ...

... which will be associated to its own invariant namespace.

Unlike the sublists, the bottom level represents the full map, so it will have its own invariant definition ...

... parameterized by the left sentinel node ...

... and the ghost names for the bottom level.

</sub> {{< /speaker_note >}}

---

### Sublists

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  Each sublist invariant will be defined with the same predicate
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  The sublist invariant and namespace are parameterized by the current level
  {{< /fragment >}}

  {{< fragment weight=3 >}}
  The ghost names from the current level and its lower level are both required
  {{< /fragment >}}
</div>

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  <span class="inv">
  $ \textsf{SublistInv}(lvl, head, \gamma^{lvl}, \gamma^{lvl-1}) $
  </span><sup class="name">$ \ \textsf{levelN}(lvl) $</sup>
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  <span class="inv">
  $ \textsf{SublistInv}(\textcolor{red}{lvl}, head, \gamma^{lvl}, \gamma^{lvl-1}) $
  </span><sup class="name">$ \ \textcolor{red}{\textsf{levelN}(lvl)} $</sup>
  {{< /fragment >}}

  {{< fragment weight=3 >}}
  <span class="inv">
  $ \textsf{SublistInv}(lvl, head, \textcolor{red}{\gamma^{lvl}}, \textcolor{red}{\gamma^{lvl-1}}) $
  </span><sup class="name">$ \ \textsf{levelN}(lvl) $</sup>
  {{< /fragment >}}
</div>

{{< speaker_note >}} <sub>

For the remaining levels, we use a different invariant definition ...

... which is parameterized by the considered level.

Besides the level's ghost names, the invariant also requires the ghost names for the lower level to reason about the sublist relation.

</sub> {{< /speaker_note >}}

---

### Definition

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  $\textsf{IsSkipList}$ is thus defined with ...
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  ... the left sentinel assertions, ...
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  ... the bottom list invariant, ...
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  ... the invariants for all sublists and ...
  {{< /fragment >}}

  {{< fragment weight=5 >}}
  ... a ghost variable for a partial view of the map
  {{< /fragment >}}
</div>

{{< fragment weight=1 >}}
<span class="smath">$ \textsf{IsSkipList}(p, M, q, \gamma) \triangleq $</span>
{{< /fragment >}}
{{< fragment weight=2 >}}
<span class="smath">$ \exists \ head. \ p \hookrightarrow_\square head * head\textsf{.key} = \textsf{MIN} $</span>
{{< /fragment >}}
{{< fragment weight=3 >}}
<span class="smath">$*$</span>
{{< /fragment >}}

{{< fragment weight=5 >}}
<span class="ghost"> 
$ \circ_q \ M $
</span><sup class="name">$ \ \gamma^0_F $</sup>
{{< /fragment >}}
{{< fragment weight=5 >}}
<span class="smath">$*$</span>
{{< /fragment >}}
{{< fragment weight=3 >}}
<span class="inv">
$\textsf{BotListInv}(head, \gamma^0) $
</span><sup class="name">$ \ \textsf{levelN}(0) $</sup>
{{< /fragment >}}
{{< fragment weight=4 >}}
<span class="smath">$*$</span>
{{< /fragment >}}

{{< fragment weight=4 >}}
<span class="smath">
$ \mathop{\Huge\ast}\limits_{lvl = 1}^{\textsf{HMAX}} $
</span>
<span class="inv">
$ \textsf{SublistInv}(lvl, head, \gamma^{lvl}, \gamma^{lvl-1}) $
</span><sup class="name">$ \ \textsf{levelN}(lvl) $</sup>
{{< /fragment >}}

{{< speaker_note >}} <sub>

The IsSkipList predicate can thus be defined by joining all these pieces together ...

... the left sentinel assertions ...

... the bottom list invariant ...

... the sublist invariants for all remaining levels ...

... and also a ghost variable for the partial view of the map which we will now discuss while defining the bottom list invariant.

</sub> {{< /speaker_note >}}

</section>

---

<section>

## Bottom List Invariant

<sup> (continue below) </sup>

{{< speaker_note >}} <sub>

For the bottom list invariant, we need to match the physical state of JellyFish with the map abstraction.

</sub> {{< /speaker_note >}}

---

### Authoritative Ghost State

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  Partial views are obtained through an authoritative resource algebra
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  Resources can be either authoritative ($\bullet$) or fragments ($\circ$)
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  Composition of all fragments yields the authoritative resource
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  Fragments will serve as partial views for the full authoritative map
  {{< /fragment >}}

  {{< fragment weight=5 class=current-visible >}}
  Fragment composition is performed by the underlying RA
  {{< /fragment >}}

  {{< fragment weight=6 >}}
  Fractions indicate whether we have composed all existing fragments
  {{< /fragment >}}
</div>

<div class="r-stack">
  {{< fragment weight=5 class=fade-out >}}
  {{< fragment weight=1 >}}
  <span class="ghost"> 
  $ \bullet \ a $
  </span><sup class="name">$ \ \gamma $</sup>
  <span class="smath">$*$</span>
  <span class="ghost"> 
  $ \circ \ f $
  </span><sup class="name">$ \ \gamma $</sup>
  {{< fragment weight=3 >}}
  <span class="smath">$ \vdash f \preccurlyeq a $</span>
  {{< /fragment >}}
  {{< /fragment >}}
  {{< /fragment >}}

  {{< fragment weight=5 class=current-visible >}}
  <span class="smath">
  $ \circ \ f_1 \cdot \circ \ f_2 = \circ \ (f_1 \cdot f_2) $
  </span>
  {{< /fragment >}}

  {{< fragment weight=6 >}}
  <span class="smath">
  $ \circ_{q_1} \ f_1 \cdot \circ_{q_2} \ f_2 = \circ_{q_1 + q_2} \ (f_1 \cdot f_2) $
  </span>
  {{< /fragment >}}
</div>

{{< speaker_note >}} <sub>

A partial view of a shared object can be obtained through an authoritative resource algebra.

This algebra contains multiple fragments and an authoritative resource ...

... composed by those fragments.

An authoritative map is thus stored inside the invariant reflecting the full map, while each thread holds its own fragment to reflect its partial view.

Fragments are composed through the underlying resource algebra ...

... and fractions indicate whether we have combined all existing fragments.

</sub> {{< /speaker_note >}}

---

### Set Membership

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  Set membership assertions are required to verify traversals
  {{< /fragment >}}

  {{< fragment weight=2 >}}
  Fragments express that notion, regardless of the state of the authoritative resource
  {{< /fragment >}}
</div>

{{< fragment weight=1 >}}
<span class="ghost"> 
$ \bullet \ S $
</span><sup class="name">$ \ \gamma $</sup>
<span class="smath">$*$</span>
<span class="ghost"> 
$ \circ \ \{ \ node \ \} $
</span><sup class="name">$ \ \gamma $</sup>
{{< /fragment >}}
{{< fragment weight=2 >}}
<span class="smath">
$ \vdash node \in S $
</span>
{{< /fragment >}}

{{< speaker_note >}} <sub>

Traversing a list requires a set membership assertion, which we can also obtain from an authoritative resource algebra.

Owning a fragment for a singleton set with the visited node entails that the node belongs to the full set without knowing the concrete state of the set.

</sub> {{< /speaker_note >}}

---

### Key-Value Pairs

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  A node's vertical list should store some value node at its head
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  The map should associate the node's key to the value node's timestamp ...
  {{< /fragment >}}

  {{< fragment weight=3 >}}
  ... and to a set of values containing the value from the value node
  {{< /fragment >}}
</div>

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  <span class="smath">
  $ \exists \ v. \ node\textsf{.val} \hookrightarrow_{\frac{1}{2}} v $
  </span>
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  <span class="smath">
  $ \exists \ vs. \ M[node\textsf{.key}] = \textsf{Some}(vs, v\textsf{.ts}) $
  </span>
  {{< /fragment >}}

  {{< fragment weight=3 >}}
  <span class="smath">
  $ v\textsf{.val} \in vs $
  </span>
  {{< /fragment >}}
</div>

{{< speaker_note >}} <sub>

Each node of the set should have a value stored in the head of its vertical list.

The corresponding map entry should agree with the node's timestamp, while keeping a set of possible values ...

... containing the actual value stored in memory.

</sub> {{< /speaker_note >}}

---

### Sortedness

<div class="r-stack">
  {{< fragment weight=1 >}}
  The set is a sorted list, including the sentinels
  {{< /fragment >}}
</div>

<div class="r-stack">
  {{< fragment weight=1 >}}
  <span class="smath">
  $ L_\textsf{cat} \triangleq [head] +\kern-1.3ex+\kern0.8ex L +\kern-1.3ex+\kern0.8ex [\textsf{tail}] $
  </span>
  {{< /fragment >}}
</div>

{{< speaker_note >}} <sub>

The set must also reflect a sorted list, with all keys confined within both sentinel nodes.

</sub> {{< /speaker_note >}}

---

### Successor Chain

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  Each physical node should point to its successor in the abstract list
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  The array entry is mutable and stores a pointer for some successor node
  {{< /fragment >}}

  {{< fragment weight=3 >}}
  The successor pointer is immutable and must point to the corresponding successor
  {{< /fragment >}}
</div>

<span class="smath">
{{< fragment weight=1 >}}
$ \textsf{IsNext}(lvl, pred, succ) \triangleq $
{{< /fragment >}}
{{< fragment weight=2 >}}
$ \exists \ s. \ pred\textsf{.next}[lvl] \hookrightarrow_{\frac{1}{2}} s $
{{< /fragment >}}
{{< fragment weight=3 >}}
$ * \ s \hookrightarrow_\square succ $
{{< /fragment >}}
</span>

{{< speaker_note >}} <sub>

The chain of successors obtained by each node's pointer should reflect the order of this list.

The corresponding array entry is mutable, storing a pointer for the successor in the list.

This successor pointer should be immutable, since multiple nodes might point to the same node at different levels.

</sub> {{< /speaker_note >}}

---

### Lock Resources

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  Each node holds a lock for the given level, along with the corresponding lock invariant
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  The lock resources include the node's successor and the successor's value
  {{< /fragment >}}

  {{< fragment weight=3 >}}
  Both pointers are fractional to allow read access to threads which have not acquired the lock
  {{< /fragment >}}
</div>

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  <span class="smath">
  $ \textsf{HasLock}(lvl, node, R) \triangleq \exists \ \gamma, l. \begin{array}{c} node\textsf{.lock}[lvl] \hookrightarrow_\square l \ * \\ \textsf{IsLock}(\gamma, l, R(node, lvl)) \end{array} $
  </span>
  {{< /fragment >}}

  {{< fragment weight=2 >}}
  <span class="smath">
  $ \textsf{InBotLock}(n, 0) \triangleq \exists \ s, succ. \begin{array}{c} n\textsf{.next}[0] \hookrightarrow_{\frac{1}{2}} s * s \hookrightarrow_\square succ \ * \\ (succ = \textsf{tail} \lor \exists \ v. \ succ\textsf{.val} \hookrightarrow_{\frac{1}{2}} v) \end{array} $
  </span>
  {{< /fragment >}}
</div>

{{< speaker_note >}} <sub>

Each node should contain a lock for the level, which maintains the lock invariant with some resources.

For bottom list nodes, the resources protected by the lock are the node's successor and the vertical list of this successor.

The points-to assertions are fractional allowing other threads to read their contents without acquiring the lock, while a locking thread will obtain write access to those memory positions.

</sub> {{< /speaker_note >}}

---

### Invariant Definition

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  $\textsf{BotListInv}$ is thus defined with ...
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  ... the authoritative map, ...
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  ... the authoritative set, ...
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  ... their node-wise equivalence, ...
  {{< /fragment >}}

  {{< fragment weight=5 class=current-visible >}}
  ... the sorted list, ...
  {{< /fragment >}}

  {{< fragment weight=6 class=current-visible >}}
  ... the successor chain and the lock resources ...
  {{< /fragment >}}

  {{< fragment weight=7 >}}
  ... and a set of tokens for the sublist relation
  {{< /fragment >}}
</div>

{{< fragment weight=1 >}}
<span class="smath">
$ \textsf{BotListInv}(head, \gamma) \triangleq \exists \ M, S, L. $
</span>
{{< /fragment >}}
{{< fragment weight=2 >}}
<span class="ghost"> 
$ \bullet \ M $
</span><sup class="name">$ \ \gamma_F^{\phantom{0}} $</sup>
{{< /fragment >}}
{{< fragment weight=3 >}}
<span class="smath">
$ * $
</span>
{{< /fragment >}}
{{< fragment weight=4 >}}
<span class="smath">
$ M\textsf{.keys} = S\textsf{.keys} \ * $
</span>
{{< /fragment >}}

{{< fragment weight=7 >}}
<span class="ghost"> 
$ \textsf{KeyRange} \setminus S\textsf{.keys} $
</span><sup class="name">$ \ \gamma_T^{\phantom{0}} $</sup>
<span class="smath">$*$</span>
{{< /fragment >}}
{{< fragment weight=3 >}}
<span class="ghost"> 
$ \bullet \ S $
</span><sup class="name">$ \ \gamma_A^{\phantom{0}} $</sup>
{{< /fragment >}}
{{< fragment weight=4 >}}
<span class="smath">$*$</span>
{{< /fragment >}}
{{< fragment weight=5 >}}
<span class="smath">
$ S \equiv_P L * \ \textsf{Sorted}(L_\textsf{cat}) \ * $
</span>
{{< /fragment >}}

{{< fragment weight=6 >}}
<span class="smath">
$
\mathop{\Huge\ast}\limits_{i = 0}^{|L|}
\left( 
  \begin{matrix}
    \textsf{IsNext}(0, L_\textsf{cat}[i], L_\textsf{cat}[i+1]) \ * \\
    \textsf{HasLock}(0, L_\textsf{cat}[i],  \textsf{InBotLock})
  \end{matrix}
\right) \ * 
$
</span>
{{< /fragment >}}
{{< fragment weight=4 >}}
<span class="smath">
$
\mathop{\Huge\ast}\limits_{n \in S}
\left( 
  \exists \ v, vs.
  \begin{matrix}
    n\textsf{.val} \hookrightarrow_{\frac{1}{2}} v * v\textsf{.val} \in vs \ * \\
    M[n\textsf{.key}] = \textsf{Some}(vs, v\textsf{.ts})
  \end{matrix}
\right)
$
</span>
{{< /fragment >}}

{{< speaker_note >}} <sub>

The bottom list invariant is thus defined by combining all elements:

The authoritative map, ...

... the authoritative set ...

and the equivalence between both.

The sortedness assertion, ...

... as well as the successor chain and lock assertions.

There is also a set of tokens, required for the sublist relation between consecutive levels ...

</sub> {{< /speaker_note >}}

</section>

---

<section>

## Sublist Invariant

<sup> (continue below) </sup>

{{< speaker_note >}} <sub>

... which will now be the focus of our attention.

</sub> {{< /speaker_note >}}

---

### Sublist Relation

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  For two consecutive levels, the upper level must be a sublist of the lower level
  {{< /fragment >}}

  {{< fragment weight=2 >}}
  As such, upper level nodes keep fragments of the lower level's authoritative set
  {{< /fragment >}}
</div>

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  <img src="images/sub.svg">
  {{< /fragment >}}

  {{< fragment weight=2 >}}
  <img src="images/sub1.svg">
  {{< /fragment >}}
</div>

{{< speaker_note >}} <sub>

Each level must contain a sublist of the list contained in its lower level.

For this reason, we associate each sublist node to a fragment of the lower level's authoritative set, expressing the sublist relation.

</sub> {{< /speaker_note >}}

---

### Ghost Tokens

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  Upon insertion, the code does not check if the key already exists in the upper levels
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  Each level will hold a set of ghost tokens to be removed and associated with upper level nodes
  {{< /fragment >}}

  {{< fragment weight=3 >}}
  Tokens are exclusive, so any new node will have a different token than other existing nodes
  {{< /fragment >}}
</div>

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  <img src="images/tok.svg">
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  <img src="images/tok1.svg">
  {{< /fragment >}}

  {{< fragment weight=3 >}}
  <img src="images/tok2.svg">
  {{< /fragment >}}
</div>

{{< speaker_note >}} <sub>

When inserting in the upper levels, we do not check if the key already exists there, because we already checked the bottom level, which contains all keys.

Since we do not prove this explicitly in the code, we require each level to keep a set of available tokens and associate each sublist node to a lower level token.

By enforcing each token to be exclusive, a new node will require a different token than the tokens for existing nodes, making it safe to insert in any upper level.

</sub> {{< /speaker_note >}}

---

### Lock Resources

<div class="r-stack">
  {{< fragment weight=1 >}}
  The lock resources no longer include the successor's value
  {{< /fragment >}}
</div>

{{< fragment weight=1 >}}
<span class="smath">
$ \textsf{InSubLock}(n, lvl) \triangleq \exists \ s. \ n\textsf{.next}[lvl] \hookrightarrow_{\frac{1}{2}} s $
</span>
{{< /fragment >}}

{{< speaker_note >}} <sub>

The sublist locks only protect the node's successor in that level, leaving the value of the successor to the bottom list locks.

</sub> {{< /speaker_note >}}

---

### Invariant Definition

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  $\textsf{SublistInv}$ is thus defined with ...
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  ... the authoritative set and sorted list, ...
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  ... the successor chain and the lock resources, ...
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  ... the set of available tokens ...
  {{< /fragment >}}

  {{< fragment weight=5 >}}
  ... and the fragments and tokens of each node
  {{< /fragment >}}
</div>

{{< fragment weight=1 >}}
<span class="smath">
$ \textsf{SublistInv}(lvl, head, \Gamma, \gamma) \triangleq \exists \ S, L. $
</span>
{{< /fragment >}}

{{< fragment weight=4 >}}
<span class="ghost"> 
$ \textsf{KeyRange} \setminus S\textsf{.keys} $
</span><sup class="name">$ \ \Gamma_T^{\phantom{0}} $</sup>
<span class="smath">$*$</span>
{{< /fragment >}}
{{< fragment weight=2 >}}
<span class="ghost"> 
$ \bullet \ S $
</span><sup class="name">$ \ \Gamma_A^{\phantom{0}} $</sup>
<span class="smath">
$ * \ S \equiv_P L * \ \textsf{Sorted}(L_\textsf{cat}) $
</span>
{{< /fragment >}}
{{< fragment weight=3 >}}
<span class="smath">$*$</span>
{{< /fragment >}}

{{< fragment weight=3 >}}
<span class="smath">
$
\mathop{\Huge\ast}\limits_{i = 0}^{|L|}
\left( 
  \begin{matrix}
    \textsf{IsNext}(lvl, L_\textsf{cat}[i], L_\textsf{cat}[i+1]) \ * \\
    \textsf{HasLock}(lvl, L_\textsf{cat}[i],  \textsf{InSubLock})
  \end{matrix}
\right)
$
</span>
{{< /fragment >}}
{{< fragment weight=5 >}}
<span class="smath">
$
* \ \mathop{\Huge\ast}\limits_{n \in S}
\left(
  \vphantom{\begin{matrix}
    n\textsf{.val} \hookrightarrow_{\frac{1}{2}} v * v\textsf{.val} \in vs \ * \\
    M[n\textsf{.key}] = \textsf{Some}(vs, v\textsf{.ts})
  \end{matrix}}
\right. \!
$
</span>
<span class="ghost"> 
$ \circ \ \{ n \} $
</span><sup class="name">$ \ \gamma_A^{\phantom{0}} $</sup>
<span class="smath">$*$</span>
<span class="ghost"> 
$ \{ n\textsf{.key} \} $
</span><sup class="name">$ \ \gamma_T^{\phantom{0}} $</sup>
<span class="smath">
$
\! \! \! \left.
  \vphantom{\begin{matrix}
    n\textsf{.val} \hookrightarrow_{\frac{1}{2}} v * v\textsf{.val} \in vs \ * \\
    M[n\textsf{.key}] = \textsf{Some}(vs, v\textsf{.ts})
  \end{matrix}}
\right)
$
</span>
{{< /fragment >}}

{{< speaker_note >}} <sub>

The sublist invariant is thus defined with ...

... the same authoritative set and sorted list, ...

... the same successor chain and the lock assertions for the sublist lock resources, ...

... the set of available tokens ...

... and the lower level fragments and tokens for each node.

</sub> {{< /speaker_note >}}

</section>

---

<section>

## Vertical List

<sup> (continue below) </sup>

{{< speaker_note >}} <sub>

Although the bottom list invariant only accounts for the head of the vertical list, we now show how the remainder of the node's value history is preserved.

</sub> {{< /speaker_note >}}

---

### Update procedure

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  $\textsf{udpate}$ controls which values are appended to vertical lists
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  Ownership of the initial value is required
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}

  The update does not occur if the new timestamp is less recent than the head's timestamp
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  Otherwise, the value is appended to the vertical list
  {{< /fragment >}}

  {{< fragment weight=5 >}}
  The chain is made persistent, yielding an immutable history of values
  {{< /fragment >}}
</div>

{{< fragment weight=2 >}}
<span class="smath">
$$ \{ \ ... \ node\textsf{.val} \hookrightarrow_{\frac{1}{2}} val \ ... \ \} $$
</span>
{{< /fragment >}}

{{< fragment weight=1 >}}
<span class="smath">
$$ \ \textsf{update} \ node \ v \ t \ $$
</span>
{{< /fragment >}}

<div class="r-stack">
  {{< fragment weight=3 class=current-visible >}}
  <span class="smath">
  $ \left\{ \ ... \ 
  \begin{matrix}
    \textbf{\textsf{if}} \ t < val\textsf{.ts} \ \textbf{\textsf{then}} \ node\textsf{.val} \hookrightarrow_{\frac{1}{2}} val \\
    \phantom{\textbf{\textsf{else}} \ \exists \ p. \ node\textsf{.val} \hookrightarrow_{\frac{1}{2}} (v, t, p) * p \hookrightarrow_\square val}
  \end{matrix}
  \ ... \ \right\} $
  </span>
  {{< /fragment >}}

  {{< fragment weight=4 >}}
  <span class="smath">
  $ \left\{ \ ... \ 
  \begin{matrix}
    \textbf{\textsf{if}} \ t < val\textsf{.ts} \ \textbf{\textsf{then}} \ node\textsf{.val} \hookrightarrow_{\frac{1}{2}} val \\
    \textbf{\textsf{else}} \ \exists \ p. \ node\textsf{.val} \hookrightarrow_{\frac{1}{2}} (v, t, p) * p \hookrightarrow_\square val
  \end{matrix}
  \ ... \ \right\} $
  </span>
  {{< /fragment >}}
</div>

{{< speaker_note >}} <sub>

An internal procedure is responsible for updating the node's vertical list.

The precondition for its specification includes the points-to assertion for the initial value.

If the new timestamp is less recent than the value already stored, then the update does not occur.

Otherwise, the new value and timestamp are appended to the head.

Asserting that the new value's predecessor is persistent, ensures that the node's value history is immutable by construction.

</sub> {{< /speaker_note >}}

</section>

---

<section>

## Related Work

<sup> (continue below) </sup>

{{< speaker_note >}} <sub>

I will now highlight some of the most relevant related work.

</sub> {{< /speaker_note >}}

---

### Polaris

<div class="r-stack">
  {{< fragment class=current-visible >}}
  Our mechanization is mostly based on the work of [Tassarotti and Harper](https://doi.org/10.1145/3290377) (POPL 2019)

  In their work, they present Polaris, an extension of Iris to support probabilistic reasoning.
  {{< /fragment >}}

  {{< fragment >}}
  In Polaris, they proved correctness and probabilistic properties of a 2-level concurrent skip list

  We generalize their correctness proofs to any number levels, simplifying the required ghost state
  {{< /fragment >}}
</div>

{{< speaker_note >}} <sub>

Most of our mechanization effort is deeply based on the work of Tassarotti and Harper on Polaris, a probabilistic extension of Iris.

Their work focused more on proving probabilistic properties of a 2-level skip list, while we generalized their arguments to an arbitrary number of levels, simplifying the ghost state for in-level reasoning.

</sub> {{< /speaker_note >}}

---

### Logical Atomicity

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  Logically atomic triples state that the operation takes place at a single atomic step
  {{< /fragment >}}

  {{< fragment >}}
  Non-atomic operations can be seen as atomic, whose changes are caused by that atomic step
  {{< /fragment >}}
</div>

{{< fragment weight=1 >}}
<span class="smath">
$ \left\langle \ P \ \right\rangle $
$ \ e \ $
$ \left\langle \ v. \ Q(v) \ \right\rangle $
</span>
{{< /fragment >}}

{{< speaker_note >}} <sub>

An important correctness criterion for concurrent operations is logical atomicity. Iris allows the definition of logically atomic triples, meaning that a potentially non-atomic operation transforms the precondition into the postcondition at a single atomic step.

That atomic step suffices to reason about interference between concurrent operations, allowing us to treat a non-atomic operation as if it were atomic.

</sub> {{< /speaker_note >}}

---

### Key-Value Specifications

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  From a logically atomic map specification, [Xiong *et al.*](https://doi.org/10.1007/978-3-662-54434-1_36) (ESOP 2017) derive a key-value specification
  {{< /fragment >}}

  {{< fragment class=current-visible >}}
  Such specifications allow reasoning about individual keys rather than the entire state of the map
  {{< /fragment >}}

  {{< fragment >}}
  Any algebra (*e.g.*, our $\textsf{argmax}$ RA) can be built on top of the specification to reason about clients
  {{< /fragment >}}
</div>

{{< fragment weight=1 >}}
<span class="smath">
$ \left\langle \ \textsf{Key}(p, k, v_i^?, \gamma) \ \right\rangle $
$ \ \textsf{put} \ p \ k \ v \ t \ $
$ \left\langle \ \textsf{Key}(p, k, v_i^? \cdot \textsf{Some}(v, t), \gamma) \ \right\rangle $
</span>
{{< /fragment >}}

{{< speaker_note >}} <sub>

Xiong et al. define a logically atomic specification for a concurrent map, which they then use to define a key-value specification.

Key-value specifications allow reasoning about composition and sharing of individual keys rather than sharing the entire map.

They also show how to apply client reasoning on top of this specification by constructing a suitable algebra, much like we did with the argmax resource algebra.

</sub> {{< /speaker_note >}}

</section>

---

<section>

## Conclusion

<sup> (continue below) </sup>

{{< speaker_note >}} <sub>

To conclude, this work contributes to the understanding of complex list-based data structures, providing a new approach for reasoning about concurrent maps.

</sub> {{< /speaker_note >}}

---

### Future Work

{{< fragment >}}
- Verifying other skip list implementations (*e.g.*, the original JellyFish)
{{< /fragment >}}

{{< fragment >}}
- Proving logical atomicity for the map operations of lazy JellyFish
{{< /fragment >}}

{{< fragment >}}
- Deriving a key-value specification from the logically atomic map specification
{{< /fragment >}}

{{< fragment >}}
- Constructing new RAs for verifying other types of clients (*e.g.*, producer-consumer)
{{< /fragment >}}

{{< speaker_note >}} <sub>

We leave as future work ...

... adapting of our proofs to other skip list implementations, ...

... proving the map operations to be logically atomic, ...

... refactoring the proofs to define a key-value specification ...

... and constructing other expressive resource algebras for client reasoning.

</sub> {{< /speaker_note >}}

</section>

---

# Thank you!

{{< speaker_note >}} <sub>

Thank you for your attention and I am now available to answer any questions you may have.

</sub> {{< /speaker_note >}}