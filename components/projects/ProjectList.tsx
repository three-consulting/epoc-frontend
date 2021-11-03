import React from 'react';
import { List, ListItem, Box } from '@chakra-ui/layout';
import { Project } from '@/lib/types/common';
import ProjectEntry from './ProjectEntry';

type ProjectListProps = {
    projects: Project[];
};
function ProjectList({ projects }: ProjectListProps): JSX.Element {
    if (projects && projects?.length > 0) {
        return (
            <List>
                {projects.map((el, idx) => {
                    return (
                        <ListItem key={idx}>
                            <ProjectEntry project={el}></ProjectEntry>
                        </ListItem>
                    );
                })}
            </List>
        );
    } else {
        return <Box>No projects found</Box>;
    }
}

export default ProjectList;
