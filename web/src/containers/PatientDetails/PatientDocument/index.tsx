import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { isSuccess, notAsked, RemoteData } from 'aidbox-react/lib/libs/remoteData';
import { WithId } from 'aidbox-react/lib/services/fhir';

import { Patient, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { BaseQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm';
import { useSavedMessage } from 'src/components/BaseQuestionnaireResponseForm/hooks';
import {
    AnxietyScore,
    DepressionScore,
} from 'src/components/BaseQuestionnaireResponseForm/readonly-widgets/score';
import { Spinner } from 'src/components/Spinner';

import { PatientHeaderContext } from '../PatientHeader/context';
import s from './PatientDocument.module.scss';
import { PatientDocumentHeader } from './PatientDocumentHeader';
import { usePatientDocument } from './usePatientDocument';

interface Props {
    patient: Patient;
    questionnaireResponse?: WithId<QuestionnaireResponse>;
    questionnaireId?: string;
    encounterId?: string;
    onSuccess?: () => void;
}

export function PatientDocument(props: Props) {
    const params = useParams<{ questionnaireId: string; encounterId?: string }>();
    const encounterId = props.encounterId || params.encounterId;
    const questionnaireId = props.questionnaireId || params.questionnaireId!;
    const { response } = usePatientDocument({
        ...props,
        questionnaireId,
        encounterId,
    });
    const navigate = useNavigate();

    const { setBreadcrumbs } = useContext(PatientHeaderContext);
    const location = useLocation();

    const [draftSaveResponse, setDraftSaveResponse] =
        useState<RemoteData<QuestionnaireResponse>>(notAsked);

    const { savedMessage } = useSavedMessage(draftSaveResponse);

    useEffect(() => {
        if (isSuccess(response)) {
            setBreadcrumbs({
                [location?.pathname]: response.data.formData.context.questionnaire?.name || '',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response]);

    return (
        <div className={s.container}>
            <div className={s.content}>
                <RenderRemoteData remoteData={response} renderLoading={Spinner}>
                    {({ formData, onSubmit, provenance }) => (
                        <>
                            <PatientDocumentHeader
                                formData={formData}
                                questionnaireId={questionnaireId}
                                draftSaveResponse={draftSaveResponse}
                                savedMessage={savedMessage}
                            />

                            <BaseQuestionnaireResponseForm
                                formData={formData}
                                onSubmit={onSubmit}
                                itemControlQuestionItemComponents={{
                                    'anxiety-score': AnxietyScore,
                                    'depression-score': DepressionScore,
                                }}
                                onCancel={() => navigate(-1)}
                                saveButtonTitle={'Complete'}
                                autoSave={!provenance}
                                draftSaveResponse={draftSaveResponse}
                                setDraftSaveResponse={setDraftSaveResponse}
                            />
                        </>
                    )}
                </RenderRemoteData>
            </div>
        </div>
    );
}
