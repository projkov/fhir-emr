import styled from 'styled-components/macro';

export const S = {
    DetailsItem: styled.div`
        display: flex;
        gap: 8px;
        white-space: nowrap;
        font-weight: 500;
        border-bottom: 1px solid ${({ theme }) => theme.neutralPalette.gray_4};

        &:last-child {
            border-bottom: 0;
        }
    `,
    DetailsTitle: styled.div`
        color: ${({ theme }) => theme.neutralPalette.gray_7};
        flex: 1;
        padding: 13px 12px;
    `,
    DetailsValue: styled.div`
        width: 200px;
        padding: 13px 12px;
        border-left: 1px solid ${({ theme }) => theme.neutralPalette.gray_4};
    `,
};
