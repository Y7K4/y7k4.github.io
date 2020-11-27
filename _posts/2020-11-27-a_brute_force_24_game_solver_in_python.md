---
title: A Brute Force 24 Game Solver in Python
key: 20201127
tags:
- Python
---

Brute-force search with generators and recursion. __Extremely slow__, but generic and easy to write.



<!--more-->



## Idea

Maintain a list of strings (expressions), merge two into one every time, and evaluate to see if it equals to the target.



## Code

{% highlight python %}
from itertools import permutations

def solve(nums, target=24, ops='+-*/'):
    def solve_helper(exps):
        try:
            if len(exps) == 1 and abs(eval(exps[0]) - target) < 1e-9:
                yield exps[0][1:-1]
        except ZeroDivisionError:
            pass

        for i, j in permutations(range(len(exps)), 2):
            for op in ops:
                new_exp = '(' + exps[i] + op + exps[j] + ')'
                new_exps = [new_exp] + [exp for k, exp in enumerate(exps) if k not in (i, j)]
                yield from solve_helper(new_exps)

    yield from solve_helper([str(n) for n in nums])

# examples
print(next(solve([1, 2, 3, 4]), 'no solution'))
print(next(solve([3, 3, 8, 8]), 'no solution'))
print(next(solve([4, 4, 6, 6]), 'no solution'))
print(next(solve([4, 4, 6, 6], 100), 'no solution'))
print(next(solve([1, 1, 1, 1, 1], 0, '+-'), 'no solution'))
print(next(solve([1, 1, 1, 1, 1], 1, '*/'), 'no solution'))

'''
((1+2)+3)*4
8/(3-(8/3))
no solution
(4+6)*(4+6)
no solution
(((1*1)*1)*1)*1
'''

{% endhighlight %}
