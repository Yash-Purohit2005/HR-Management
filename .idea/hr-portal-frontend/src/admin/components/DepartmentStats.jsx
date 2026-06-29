
import  DepartmentBarChart from "./DepartmentBarChart";
import Statscard from "./Statscard";


export default function DepartmentStats({ stats }) {

  const data = Object.entries(stats.departmentCounts).map(
    ([department, count]) => ({ department, count })
  );
  
  return (
    <div className="space-y-4">
      
       <DepartmentBarChart data={data} />
    </div>
  );
}
