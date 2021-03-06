const Dag = require('..');

const CycleError = require('../cycle-error');

const expect = require('chai').expect;

const deepEqual = require('deep-equal');

describe('Addition Test', () => {
  describe('DAG with addition of 4 edges', () => {
    let dag;
    let V = [];
    let T = [];
    let E = [];

    beforeEach(() => {
      dag = new Dag();
      V = ['a', 'b', 'c', 'd'];
      T = ['friend', 'follows'];
      E = [];
      E.push({ from: 'a', to: 'b', tags: ['friend'], weight: undefined });
      E.push({ from: 'b', to: 'c', tags: ['friend', 'follows'], weight: undefined });
      E.push({ from: 'd', to: 'b', tags: 'friend', weight: undefined });
      E.push({ from: 'a', to: 'd', tags: ['friend', 'follows'], weight: undefined });
      E.forEach(e => dag.add(e.from, e.to, e.tags, e.weight));
    });


    it('should have 4 verticies', () => {
      dag.order.should.equal(V.length);
      dag.V.length.should.equal(V.length);
      dag.V.forEach(v => V.should.include(v));
    });

    it('shoud have 4 edges', () => {
      dag.size.should.equal(E.length);
      dag.E.length.should.equal(E.length);
      dag.E.reduce((outterFlag, actualEdge) => {
        const edgeInclusion = E.reduce((innerFlag, edgeToInclude) =>
          innerFlag || deepEqual(actualEdge, edgeToInclude), false);
        return outterFlag && edgeInclusion;
      }, true);
    });

    it('should have 2 tags', () => {
      dag.kind.should.equal(T.length);
      dag.T.length.should.equal(T.length);
      dag.T.forEach(t => T.should.include(t));
    });

    it('should include the edges', () => {
      E.forEach(e => dag.includes(e.from, e.to).should.equal(true));
    });

    it('should have the edges', () => {
      E.forEach((e) => {
        const actual = dag.edge(e.from, e.to);
        let expected = e;
        if (!Array.isArray(e.tags)) {
          expected = { from: e.from, to: e.to, tags: [e.tags], weight: e.weight };
        }
        actual.should.deep.equal(expected);
      });
    });

    it('should not have an edge(c, a)', () => expect(dag.edge('c', 'a')).to.be.undefined);

    it('should reject a self-loop edge', () => {
      expect(() => dag.add('a', 'a', ['self', 'loop'], undefined)).to.throw(CycleError);
      dag.order.should.equal(V.length);
      dag.size.should.equal(E.length);
    });

    it('should reject a triangular edge', () => {
      expect(() => dag.add('d', 'a', ['triangle', 'cycle'], undefined)).to.throw(CycleError);
      dag.order.should.equal(V.length);
      dag.size.should.equal(E.length);
    });

    it('should reject a cyclic edge', () => {
      expect(() => dag.add('c', 'a', ['cycle'], undefined)).to.throw(CycleError);
      dag.order.should.equal(V.length);
      dag.size.should.equal(E.length);
    });
  });
});
