(and
  (eq 0 0)
  
  (eq 'humbug 'humbug)

  (begin
    (define a 3)
    (and (eq (+ a 5) 8)
         (eq (+ a 3) (* a 2))
         (eq (- a 6) (- a))
         (eq (/ a 3) 1)))
  
  (begin
    (define square (lambda (x) (* x x)))
    (and (eq (square 3) 9)
         (eq (square (- 3)) 9)))
         
  (begin
    (define z 'z)
    (eq z 'z))
  
  (if (> 1 0) #t #f)
  
  (if (> 0 1) #f #t)
  
  (begin
    (define p 9)
    (set! p 10)
    (eq p 10))
    
  (begin
    (define q 2)
    (define foo (lambda () (set! q 11)))
    (foo)
    (eq q 11))
    
  (begin
    (define d 2)
    (define e 3)
    (define f 4)
    (let ((e 4))
      (set! d (eq e f))
      (set! e 9))
    (set! e (eq e 3))
    (set! f #t)
    (and d e f))
    
  (begin
    (define a 1)
    (let ((a 0))
      (define counter (lambda () (begin (set! a (+ a 1)) a))))
    (and (eq (counter) a) (> (counter) a))) 
)