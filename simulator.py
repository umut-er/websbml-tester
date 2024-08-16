import sys
import tellurium as te

sbmlString: str = sys.argv[1]
r = te.loadSBMLModel(sbmlString)
output = r.simulate(0, 10, 100)
print(output)
