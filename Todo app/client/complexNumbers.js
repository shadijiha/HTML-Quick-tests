/***
*
*
*   Shado complex numbers library
*
*/


class Complex   {

    constructor(a, b)   {

        this.a = a || 0.0;
        this.b = b || 0.0;
        this.phi = Math.atan(b / a);
        this.r = Math.sqrt(a * a + b * b);

    }

    fromPolar(r, phi)   {

        this.phi = phi;
        this.r = r;    
        this.a = r * Math.cos(this.phi);
        this.b = r * Math.sin(this.phi);   

    }

    equals(complexNum)  {
        if (this.a == complexNum.a && this.b == complexNum.b)   {
            return true;            
        } else  {
            return false;
        }
    }

    render(arg)    {
        if (arg.toLowerCase() == "polar")   {
            return `${this.r} * ( cos(${this.phi}) + i sin(${this.phi}) )`;            
        } else  {
            return `${this.a} + ${this.b} i`;            
        }        
    }

    sum(numB)   {
        return new Complex(this.a + numB.a, this.b + numB.b);
    }

    substract(numB) {
        return new Complex(this.a - numB.a, this.b - numB.b);
    }

    multiply(numB)  {
        var result = new Complex();
        result.fromPolar(this.r * numB.r, this.phi + numB.phi);

        return result;
    } 

    divide(numB)    {
        var result = new Complex();
        result.fromPolar(this.r / numB.r, this.phi - numB.phi);

        return result;       
    }

    conjugate() {
        return new Complex(this.a, -1 * this.b);
    }

    power(exposant) {
        var result = new Complex();
        result.fromPolar( Math.pow(this.r, exposant) , this.phi * exposant);

        return result;     
    }

    root(degree)    {
        var result = [];
		var tempR = pow(r, 1 / degree);

		for (var i = 0; i < degree; i++) {			
			var tempPhi = (this.phi + 2 * PI * i) / degree;			
			var temp = new Complex();
            temp.fromPolar(tempR, tempPhi);

            result.push(temp);
		}

		return result;
    }

    renderRoot(degree)    {
        var roots = this.root(degree);
        var str = "";

        for (let root of roots) {
            str += root.render();
            str += '\n';
        }

        return str;
    }

    realPart()    {
        return this.a;
    }

    imaginaryPart()    {
        return this.b;
    }

    mag()   {
        return this.r;
    }

    abs()   {
        this.mag();
    }
}