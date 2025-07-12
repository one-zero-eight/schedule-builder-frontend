import SvgIconSmile from '../Smile'

const NoConflicts = () => {
  return (
    <div className="flex flex-col items-center justify-center">
         <p className="text-white text-center py-4 text-xl font-bold">
          No conflicts detected
        </p>
        <SvgIconSmile className="w-50 h-50" />
    </div>
  )
}

export default NoConflicts