const Notification = ({ message, isError=false}) => {
  if (message === null) {
    return null
  }
  
  return (
    <div className="notification" style={{ color: isError ? "red" : "green" }}>
      {message}
    </div>
  )
}

export default Notification