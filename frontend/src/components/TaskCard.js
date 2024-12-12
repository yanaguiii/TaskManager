import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import '../TaskCard.css';


const TaskCard = ({ task, index, moveTask, startEditing, deleteTask, toggleComplete }) => {
    const ref = useRef(null);

    const [{ isDragging }, drag] = useDrag({
        type: 'TASK',
        item: { id: task.id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    const [, drop] = useDrop({
        accept: 'TASK',
        hover(item) {
            if (!ref.current) return;
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) return;
            moveTask(dragIndex, hoverIndex);
            item.index = hoverIndex;
        }
    });

    drag(drop(ref));

    return (
        <div
            ref={ref}
            className="task-card"
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <div className="task-header">
                <h3>{task.title}</h3>
                <div className="task-actions">
                    <button onClick={() => startEditing(task)} className="edit-btn">
                        Edit
                    </button>
                    <button onClick={() => deleteTask(task.id)} className="delete-btn">
                        Delete
                    </button>
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleComplete(task.id, task.completed)}
                        className="task-checkbox"
                    />
                </div>
            </div>
            <p>{task.description}</p>
            <span className={`status ${task.completed ? 'completed' : 'pending'}`}>
        {task.completed ? 'Completed' : 'Pending'}
      </span>
        </div>
    );
};

export default TaskCard;
