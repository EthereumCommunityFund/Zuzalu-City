import { Stack, StackProps } from "@mui/material";

interface TextButtonPropTypes extends StackProps {
    content?: string
}

export const TextButton = ({ content }: TextButtonPropTypes) => {
    return (
        <Stack
            sx={{
                width: '100%',
                padding: '6px 10px',
                fontSize: '13px',
                fontWeight: '700',
                lineHeight: '120%',
                textTransform: 'capitalize',
                boxSizing: 'border-box'
            }}
        >
            {
                content
            }
        </Stack>
    )
}